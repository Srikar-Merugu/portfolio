import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      voiceTier = 'tier3', // default to tier3 (ElevenLabs)
      voiceGender = 'female',
      elevenLabsVoiceId,
      openAiVoice,
      userOpenAiKey,
      userElevenLabsKey,
    } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Determine API keys (prioritize user key from request, fallback to env)
    const elevenLabsApiKey = userElevenLabsKey?.trim() || process.env.ELEVENLABS_API_KEY?.trim() || '';
    const openAiApiKey = userOpenAiKey?.trim() || process.env.OPENAI_API_KEY?.trim() || '';

    // If tier3 is requested and elevenLabs key is available, try ElevenLabs
    if (voiceTier === 'tier3' && elevenLabsApiKey) {
      try {
        console.log('[TTS API] Attempting ElevenLabs TTS');
        // ElevenLabs voice defaults
        // Rachel: 21m00Tcm4TlvDq8ikWAM (female)
        // Adam: pNInz6obpgqjVW4XtkHJ (male)
        const defaultVoiceId = voiceGender === 'male' ? 'pNInz6obpgqjVW4XtkHJ' : '21m00Tcm4TlvDq8ikWAM';
        const voiceId = elevenLabsVoiceId || defaultVoiceId;

        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        });

        if (res.ok) {
          const buffer = await res.arrayBuffer();
          console.log('[TTS API] ElevenLabs TTS Succeeded');
          // Return audio buffer
          return new Response(buffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
            },
          });
        } else {
          const errText = await res.text();
          console.error('[TTS API] ElevenLabs API error:', res.status, errText);
          // Fall through to OpenAI
        }
      } catch (err) {
        console.error('[TTS API] ElevenLabs Exception:', err);
        // Fall through to OpenAI
      }
    }

    // Try OpenAI TTS if tier2 is requested, or if ElevenLabs was requested but failed/had no key
    // We only try OpenAI if the key is available
    if ((voiceTier === 'tier3' || voiceTier === 'tier2') && openAiApiKey) {
      try {
        console.log('[TTS API] Attempting OpenAI TTS');
        // OpenAI voice options: alloy, echo, fable, onyx, nova, shimmer
        // Nova/Shimmer for female, Onyx/Echo/Alloy/Fable for male/neutral
        const defaultVoice = voiceGender === 'male' ? 'onyx' : 'nova';
        const voice = openAiVoice || defaultVoice;

        const res = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice,
          }),
        });

        if (res.ok) {
          const buffer = await res.arrayBuffer();
          console.log('[TTS API] OpenAI TTS Succeeded');
          return new Response(buffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
            },
          });
        } else {
          const errText = await res.text();
          console.error('[TTS API] OpenAI API error:', res.status, errText);
        }
      } catch (err) {
        console.error('[TTS API] OpenAI Exception:', err);
      }
    }

    // If both failed or keys weren't configured, return a custom code to indicate fallback to browser TTS
    console.log('[TTS API] No premium TTS succeeded or keys missing. Requesting browser TTS fallback.');
    return NextResponse.json({
      error: 'Premium TTS unavailable',
      fallback: true,
      message: 'No TTS API keys available or requests failed. Falling back to Browser Web Speech API.',
    }, { status: 503 });

  } catch (err: any) {
    console.error('[TTS API] Global error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
