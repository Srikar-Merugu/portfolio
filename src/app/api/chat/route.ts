import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, profile } from '@/data/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'claude-opus-5-5';
const MAX_MESSAGES = 20;
const MAX_CHARS = 1500;

const SYSTEM_PROMPT = buildSystemPrompt();

// Best-effort per-IP limiter. Serverless instances don't share memory, so this
// only slows down abuse from a single client — set a spend limit in the
// Anthropic Console as the real ceiling.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

// Accept only well-formed user/assistant turns, trim history, and make sure
// the conversation starts with a user turn (the UI's greeting is assistant-side).
function sanitize(raw: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m): m is { role: 'user' | 'assistant'; content: string } =>
        !!m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  return msgs;
}

function logApiError(err: unknown) {
  if (err instanceof Anthropic.RateLimitError) {
    console.error('[chat] Anthropic rate limit:', err.message);
  } else if (err instanceof Anthropic.AuthenticationError) {
    console.error('[chat] Invalid ANTHROPIC_API_KEY');
  } else if (err instanceof Anthropic.APIError) {
    console.error(`[chat] Anthropic API error ${err.status}:`, err.message);
  } else {
    console.error('[chat] Stream error:', err);
  }
}

function errorJson(status: number, error: string) {
  return NextResponse.json(
    { error, contact: profile.email },
    { status },
  );
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[chat] ANTHROPIC_API_KEY is not set');
    return errorJson(503, 'offline');
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return errorJson(429, 'rate_limited');

  let messages: Anthropic.Beta.BetaMessageParam[] | null = null;
  try {
    messages = sanitize((await req.json())?.messages);
  } catch {
    /* fall through */
  }
  if (!messages) return errorJson(400, 'bad_request');

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 2000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages,
  });

  // Wait for the first event so connection/auth failures become a proper error
  // status instead of an empty 200 stream.
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    logApiError(err);
    return errorJson(err instanceof Anthropic.RateLimitError ? 429 : 502, 'upstream');
  }

  const encoder = new TextEncoder();
  const emit = (event: Anthropic.Beta.BetaRawMessageStreamEvent, controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      controller.enqueue(encoder.encode(event.delta.text));
    }
  };

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done) emit(first.value, controller);
        for (let next = await events.next(); !next.done; next = await events.next()) {
          emit(next.value, controller);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          controller.enqueue(
            encoder.encode(`I can't help with that one — but I'm happy to talk about my projects, skills or experience.`),
          );
        }
        controller.close();
      } catch (err) {
        logApiError(err);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
