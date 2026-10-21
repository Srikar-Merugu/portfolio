'use client';

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import styles from './SrikarAI.module.css';
import DigitalTwin from './DigitalTwin';
import WaveformVisualizer from './WaveformVisualizer';
import { profile, projects, skillGroups, experience, achievements, education } from '@/data/profile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const QUICK_QUESTIONS = [
  'Who are you?',
  'What are you building at Kyro Studio?',
  'Tell me about BillShield',
  "What's your tech stack?",
  'Why should I hire you?',
  'Share your resume',
];

const GREETING: Message = {
  role: 'assistant',
  content: `Hi, I'm ${profile.firstName}'s AI twin. Ask me about my projects, my work at ${profile.company}, or my stack.`,
};

const VOICE_KEY = 'srikar-ai-voice';

// Recruiter brief is built from the same data file as the site — instant and always accurate.
function buildRecruiterBrief(): string {
  const featured = projects.filter((p) => p.category !== 'Mobile').slice(0, 5);
  return [
    'PROFESSIONAL SUMMARY',
    profile.summary,
    '',
    'EXPERIENCE',
    ...experience.map((e) => `- ${e.role}, ${e.org} (${e.period})`),
    '',
    'CORE SKILLS',
    ...skillGroups.slice(0, 4).map((g) => `- ${g.label}: ${g.items.slice(0, 5).join(', ')}`),
    '',
    'KEY PROJECTS',
    ...featured.map((p) => `- ${p.title}: ${p.desc.split('. ')[0].replace(/\.$/, '')}.`),
    '',
    'HIGHLIGHTS',
    ...achievements.map((a) => `- ${a}`),
    '',
    'EDUCATION',
    `- ${education[0].title}, ${education[0].place} (${education[0].year})`,
    '',
    'CONTACT',
    `Email: ${profile.email}`,
    `Website: ${profile.website.replace('https://', '')}`,
  ].join('\n');
}

// Turn bare URLs and emails in a reply into clickable links.
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const clean = part.replace(/[.,]$/, '');
          return (
            <Fragment key={i}>
              <a href={clean} target="_blank" rel="noopener noreferrer" className={styles.msgLink}>
                {clean.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
              {part.slice(clean.length)}
            </Fragment>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          return <a key={i} href={`mailto:${part}`} className={styles.msgLink}>{part}</a>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export default function SrikarAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try { setVoiceOn(localStorage.getItem(VOICE_KEY) === 'on'); } catch { /* ignore */ }
  }, []);

  // ── Voice (browser speech synthesis, off by default) ──────────────
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;
    synth.cancel();
    const clean = text
      .replace(/https?:\/\/\S+/g, 'the link in the chat')
      .replace(/[*_#`]/g, '')
      .replace(/\n+/g, '. ')
      .trim();
    if (!clean) return;
    const utter = new SpeechSynthesisUtterance(clean);
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang.startsWith('en') && /Google US English|Natural|Daniel|Samantha/.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (voice) utter.voice = voice;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    synth.speak(utter);
  }, []);

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    try { localStorage.setItem(VOICE_KEY, next ? 'on' : 'off'); } catch { /* ignore */ }
    if (!next) stopSpeaking();
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    else stopSpeaking();
  }, [open, stopSpeaking]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // ── Chat (streams plain text from /api/chat) ──────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    stopSpeaking();
    setRecruiterMode(false);

    const history = [...messages.filter((m) => !m.error), { role: 'user' as const, content: question }];
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'error');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setLoading(false);

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: reply };
          return copy;
        });
      }
      if (!reply.trim()) throw new Error('empty');
      if (voiceOn) speak(reply);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const code = (err as Error).message;
      const msg =
        code === 'rate_limited'
          ? "You're asking faster than I can think — give me a few seconds and try again."
          : code === 'offline'
            ? `My AI twin is offline right now. You can reach the real me at ${profile.email}.`
            : `Something went wrong on my side. Please try again, or email me at ${profile.email}.`;
      setMessages((prev) => {
        const copy = [...prev];
        if (copy[copy.length - 1]?.role === 'assistant' && !reply) copy.pop();
        return [...copy, { role: 'assistant', content: msg, error: true }];
      });
    } finally {
      setLoading(false);
    }
  }, [messages, loading, voiceOn, speak, stopSpeaking]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Srikar AI chat' : 'Chat with Srikar AI'}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <div className={styles.fabRing} />
            <div className={styles.fabAvatar}>S</div>
            <div className={styles.fabLabel}>Ask my AI twin</div>
          </>
        )}
      </button>

      {/* ── Chat panel ── */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="Srikar AI chat"
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarDot}>
              <span>S</span>
              <div className={`${styles.onlineDot} ${isSpeaking ? styles.speakingGlow : ''}`} />
            </div>
            <div>
              <div className={styles.headerName}>Srikar AI</div>
              <div className={styles.headerSub}>Digital twin · answers about my work</div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.playbackBtn} ${voiceOn ? styles.playbackBtnActive : ''}`}
              onClick={toggleVoice}
              title={voiceOn ? 'Turn voice off' : 'Read replies aloud'}
              aria-label={voiceOn ? 'Turn voice off' : 'Read replies aloud'}
              aria-pressed={voiceOn}
            >
              {voiceOn ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>
              )}
            </button>
            <button
              className={`${styles.recruiterBtn} ${recruiterMode ? styles.recruiterBtnActive : ''}`}
              onClick={() => { stopSpeaking(); setRecruiterMode((r) => !r); }}
              title="One-page recruiter brief"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Recruiter Brief
            </button>
          </div>
        </div>

        {/* Avatar + waveform — only mounted while open so WebGL doesn't run in the background */}
        {open && (
          <div className={styles.digitalTwinSection}>
            <div className={styles.avatarContainer}>
              <DigitalTwin isSpeaking={isSpeaking} amplitude={isSpeaking ? 0.6 : 0} isMuted={!voiceOn} />
            </div>
            <div className={styles.waveformContainer}>
              <WaveformVisualizer isSpeaking={isSpeaking || loading} amplitude={isSpeaking ? 0.6 : loading ? 0.3 : 0} isMuted={!voiceOn && !loading} analyser={null} />
            </div>
          </div>
        )}

        {!recruiterMode ? (
          <>
            <div className={styles.messages} aria-live="polite">
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
                  {msg.role === 'assistant' && <div className={styles.bubbleAvatar}>S</div>}
                  <div className={`${styles.bubbleText} ${msg.error ? styles.bubbleError : ''}`}>
                    {msg.role === 'assistant' ? <Linkified text={msg.content} /> : msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className={`${styles.bubble} ${styles.bubbleAI}`}>
                  <div className={styles.bubbleAvatar}>S</div>
                  <div className={styles.bubbleText}>
                    <div className={styles.typingDots}><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className={styles.quickWrap}>
                {QUICK_QUESTIONS.map((q) => (
                  <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            )}

            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about my projects, stack, experience…"
                maxLength={1500}
                disabled={loading}
                aria-label="Message"
              />
              <button
                className={`${styles.sendBtn} ${(!input.trim() || loading) ? styles.sendBtnDisabled : ''}`}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.recruiterPanel}>
            <div className={styles.recruiterHeader}>
              <span>Recruiter Brief</span>
              <button onClick={() => setRecruiterMode(false)} className={styles.closeRecruiter} aria-label="Close brief">✕</button>
            </div>
            <div className={styles.recruiterContent}>
              <pre className={styles.recruiterText}>{buildRecruiterBrief()}</pre>
              <div className={styles.recruiterActions}>
                <a href={`mailto:${profile.email}`} className={styles.rAction}>Email</a>
                <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" className={styles.rAction}>Resume</a>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={styles.rAction}>GitHub</a>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={styles.rAction}>LinkedIn</a>
              </div>
            </div>
          </div>
        )}

        <div className={styles.poweredBy}>Powered by Claude · AI can make mistakes</div>
      </div>
    </>
  );
}
