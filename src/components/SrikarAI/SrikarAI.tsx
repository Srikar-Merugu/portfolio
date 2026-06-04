'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SrikarAI.module.css';
import DigitalTwin from './DigitalTwin';
import WaveformVisualizer from './WaveformVisualizer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VoiceSettings {
  voiceTier: 'tier3' | 'tier2' | 'tier1';
  voiceGender: 'male' | 'female';
  elevenLabsVoiceId: string;
  openAiVoice: string;
  browserVoiceName: string;
  voiceSpeed: number;
  voiceVolume: number;
  voiceMuted: boolean;
  autoPlayIntro: boolean;
  autoPlayResponses: boolean;
  openAiApiKey: string;
  elevenLabsApiKey: string;
}

const QUICK_QUESTIONS = [
  'Who is Srikar?',
  'Show me his projects',
  "What's his tech stack?",
  'Share his resume link',
  'Why should I hire him?',
  'His GitHub / LinkedIn?',
];

const INTRO_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello, I'm Srikar Merugu. AI Engineer, Full Stack Developer, and SaaS Builder. Welcome to my digital world.",
};

const DEFAULT_SETTINGS: VoiceSettings = {
  voiceTier: 'tier1', // Default to browser voice tier (works out-of-the-box without keys)
  voiceGender: 'female',
  elevenLabsVoiceId: '',
  openAiVoice: '',
  browserVoiceName: '',
  voiceSpeed: 1.0,
  voiceVolume: 1.0,
  voiceMuted: false,
  autoPlayIntro: true,
  autoPlayResponses: true,
  openAiApiKey: '',
  elevenLabsApiKey: '',
};

export default function SrikarAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Recruiter mode states
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [recruiterData, setRecruiterData] = useState<string | null>(null);
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  
  // Settings Panel States
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Speech & Waveform States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasOpened = useRef(false);

  // Audio elements & audio context references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Load and save settings in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('srikar-voice-settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVoiceSettings(prev => ({ ...prev, ...parsed }));
          console.log('Voice Initialized: Settings loaded from localStorage');
        } catch (e) {
          console.error('Failed to parse voice settings:', e);
        }
      } else {
        console.log('Voice Initialized: Defaults loaded');
      }

      // Populate browser voices
      const synth = window.speechSynthesis;
      if (synth) {
        const updateVoices = () => {
          const voices = synth.getVoices().filter(v => v.lang.startsWith('en'));
          setBrowserVoices(voices);
        };
        updateVoices();
        synth.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const handleSettingChange = <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
    setVoiceSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('srikar-voice-settings', JSON.stringify(updated));
      console.log(`Voice Selected: Settings changed for ${key} -> ${value}`);
      return updated;
    });
  };

  // --- Voice Control Logic ---
  const stopSpeaking = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    setAmplitude(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    console.log('Speech Ended');
  }, []);

  const speakBrowserTTS = useCallback((text: string) => {
    console.log('[VoiceEngine] Initializing Browser TTS (Tier 1)');
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) {
      console.error('Speech synthesis not supported in this browser.');
      setIsSpeaking(false);
      return;
    }

    // BUG FIX: resume() before cancel() keeps Chrome's synthesis engine alive.
    // Do NOT cancel if there is nothing speaking — cancelling the unlock utterance
    // (the empty-string utterance fired during audio unlock) kills the primed state.
    try {
      synth.resume();
      if (synth.speaking) synth.cancel();
    } catch (e) {
      console.error('Error resetting speech synthesis:', e);
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = voiceSettings.voiceSpeed;
    utter.volume = voiceSettings.voiceVolume;

    const voices = synth.getVoices();
    const selectAndSpeak = () => {
      const availableVoices = synth.getVoices();
      let preferred = availableVoices.find(v => v.name === voiceSettings.browserVoiceName);

      if (!preferred) {
        if (voiceSettings.voiceGender === 'male') {
          preferred = availableVoices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Daniel') || v.name.includes('David') || v.name.includes('Google US English Male'))
          ) || availableVoices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
        } else {
          preferred = availableVoices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Google US English') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Daniela'))
          ) || availableVoices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
        }
      }

      if (!preferred) {
        preferred = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      }

      if (preferred) {
        utter.voice = preferred;
        console.log(`Voice Selected: ${preferred.name}`);
      } else {
        console.log('Voice Selected: Default browser voice');
      }

      utter.onstart = () => {
        console.log('Speech Started');
        setIsSpeaking(true);
        setIsPaused(false);
        setAnalyserNode(null); // No Web Audio Analyser node for browser speech
      };

      utter.onend = () => {
        console.log('Speech Ended');
        setIsSpeaking(false);
        setIsPaused(false);
        setAmplitude(0);
      };

      utter.onerror = (err) => {
        console.error('Speech Failed:', err);
        setIsSpeaking(false);
        setIsPaused(false);
        setAmplitude(0);
      };

      synth.speak(utter);
    };

    if (voices.length > 0) {
      selectAndSpeak();
    } else {
      synth.onvoiceschanged = () => {
        selectAndSpeak();
        synth.onvoiceschanged = null;
      };
    }
  }, [voiceSettings]);

  const speakText = useCallback(async (text: string) => {
    stopSpeaking();

    if (voiceSettings.voiceMuted) {
      console.log('Speech muted by settings.');
      return;
    }

    // Strip markdown formatting & emojis for smoother text reading
    const cleanText = text
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
      .replace(/\*|_|#/g, '')
      .trim();

    if (voiceSettings.voiceTier === 'tier3' || voiceSettings.voiceTier === 'tier2') {
      try {
        let response = null;

        // Try ElevenLabs (Tier 3)
        if (voiceSettings.voiceTier === 'tier3') {
          console.log('[VoiceEngine] Requesting ElevenLabs Voice (Tier 3)');
          response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: cleanText,
              voiceTier: 'tier3',
              voiceGender: voiceSettings.voiceGender,
              elevenLabsVoiceId: voiceSettings.elevenLabsVoiceId,
              userElevenLabsKey: voiceSettings.elevenLabsApiKey,
              userOpenAiKey: voiceSettings.openAiApiKey,
            }),
          });

          if (!response.ok) {
            console.warn('ElevenLabs speech generation failed. Cascading to OpenAI TTS (Tier 2).');
            response = null;
          }
        }

        // Try OpenAI (Tier 2)
        if (!response && (voiceSettings.voiceTier === 'tier3' || voiceSettings.voiceTier === 'tier2')) {
          console.log('[VoiceEngine] Requesting OpenAI Voice (Tier 2)');
          response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: cleanText,
              voiceTier: 'tier2',
              voiceGender: voiceSettings.voiceGender,
              openAiVoice: voiceSettings.openAiVoice,
              userOpenAiKey: voiceSettings.openAiApiKey,
            }),
          });
        }

        if (response && response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);

          // Setup AudioContext if not initialized
          if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              audioContextRef.current = new AudioContextClass();
              analyserRef.current = audioContextRef.current.createAnalyser();
              analyserRef.current.fftSize = 256;
            }
          }

          const audio = audioRef.current || new Audio();
          audioRef.current = audio;
          audio.src = audioUrl;
          audio.playbackRate = voiceSettings.voiceSpeed;
          audio.volume = voiceSettings.voiceVolume;

          if (audioContextRef.current && analyserRef.current) {
            try {
              const source = audioContextRef.current.createMediaElementSource(audio);
              source.connect(analyserRef.current);
              analyserRef.current.connect(audioContextRef.current.destination);
            } catch (e) {
              // Already connected
            }
          }

          audio.onplay = () => {
            console.log('Speech Started');
            setIsSpeaking(true);
            setIsPaused(false);
            setAnalyserNode(analyserRef.current);

            // Animate mouth/amplitude using real audio analyser
            const bufferLength = analyserRef.current?.frequencyBinCount || 0;
            const dataArray = new Uint8Array(bufferLength);

            const updateAmplitude = () => {
              if (audioRef.current && !audioRef.current.paused && !audioRef.current.ended && analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / bufferLength;
                setAmplitude(avg / 128.0); // Normalize amplitude
                requestAnimationFrame(updateAmplitude);
              } else {
                setAmplitude(0);
              }
            };
            if (analyserRef.current) {
              requestAnimationFrame(updateAmplitude);
            }
          };

          audio.onpause = () => {
            setIsPaused(true);
          };

          audio.onended = () => {
            console.log('Speech Ended');
            setIsSpeaking(false);
            setIsPaused(false);
            setAmplitude(0);
          };

          audio.onerror = (e) => {
            console.error('Speech Failed: Audio playback error. Falling back to Browser TTS.', e);
            speakBrowserTTS(cleanText);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.error('Speech Failed: Network error. Falling back to Browser TTS.', err);
      }
    }

    // Ultimate fallback: Browser Speech Synthesis
    speakBrowserTTS(cleanText);
  }, [voiceSettings, stopSpeaking, speakBrowserTTS]);

  const togglePauseSpeech = () => {
    if (!isSpeaking) return;

    if (audioRef.current && (voiceSettings.voiceTier === 'tier3' || voiceSettings.voiceTier === 'tier2')) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
        console.log('Speech Resumed');
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        console.log('Speech Paused');
      }
    } else {
      const synth = window.speechSynthesis;
      if (synth) {
        if (isPaused) {
          synth.resume();
          setIsPaused(false);
          console.log('Speech Resumed');
        } else {
          synth.pause();
          setIsPaused(true);
          console.log('Speech Paused');
        }
      }
    }
  };

  // --- FINAL FIX: Intro voice fires on first user interaction anywhere ---
  //
  // Browser autoplay policy blocks speechSynthesis.speak() without a real
  // user gesture. We now listen for BOTH:
  //   1. 'ai-voice-unlock' — dispatched by the 🔇/🔊 mute button
  //   2. 'click' / 'touchstart' anywhere on the page — catches the first
  //      natural interaction (View Projects, GitHub, scroll, anything)
  //
  // 400ms delay on the click listener ensures loading-screen transitions
  // don't accidentally fire it before the page is interactive.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const synth = window.speechSynthesis;

    const playIntroVoice = () => {
      if (hasOpened.current) return;
      hasOpened.current = true;

      console.log('[INTRO] Playing intro voice');
      setOpen(true);

      // Read settings directly — state may not be synced yet at this point
      let speed    = DEFAULT_SETTINGS.voiceSpeed;
      let volume   = DEFAULT_SETTINGS.voiceVolume;
      let autoPlay = DEFAULT_SETTINGS.autoPlayIntro;
      try {
        const raw = localStorage.getItem('srikar-voice-settings');
        if (raw) {
          const s = JSON.parse(raw);
          if (s.voiceSpeed)  speed  = s.voiceSpeed;
          if (s.voiceVolume) volume = s.voiceVolume;
          if (typeof s.autoPlayIntro === 'boolean') autoPlay = s.autoPlayIntro;
          if (s.voiceMuted === true) autoPlay = false;
        }
      } catch (_) {}

      if (!autoPlay) {
        console.log('[INTRO] autoPlayIntro disabled — skipping voice');
        return;
      }

      try { synth.resume(); } catch (_) {}

      const doSpeak = () => {
        const utter = new SpeechSynthesisUtterance(INTRO_MESSAGE.content);
        utter.rate   = speed;
        utter.volume = volume;

        const voices = synth.getVoices();
        const voice  = voices.find(v =>
          v.lang.startsWith('en') && (
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.name.includes('Natural')  ||
            v.name.includes('Daniel')
          )
        ) || voices.find(v => v.lang.startsWith('en'));
        if (voice) utter.voice = voice;
        console.log('[INTRO] Voice:', utter.voice?.name ?? 'default browser voice');

        utter.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
        utter.onend   = () => { setIsSpeaking(false); setIsPaused(false); setAmplitude(0); };
        utter.onerror = (e: SpeechSynthesisErrorEvent) => {
          if (e.error === 'interrupted') return; // normal when cancelled
          console.error('[INTRO] Speech error:', e.error);
          setIsSpeaking(false);
        };

        synth.speak(utter);
        console.log('[INTRO] synth.speak() called ✓');
      };

      // Voices are loaded async in Chrome — wait if not ready yet
      if (synth.getVoices().length > 0) {
        doSpeak();
      } else {
        synth.onvoiceschanged = () => { synth.onvoiceschanged = null; doSpeak(); };
      }
    };

    // ── Listener 1: dedicated mute-button event ──────────────────────
    const onUnlockEvent = () => playIntroVoice();

    // ── Listener 2: ANY click anywhere (first click on page) ─────────
    const onAnyClick = () => playIntroVoice();

    // ── Listener 3: mute/unmute toggle ───────────────────────────────
    const onMuteEvent = () => {
      stopSpeaking();
      setVoiceSettings(prev => {
        const u = { ...prev, voiceMuted: true };
        localStorage.setItem('srikar-voice-settings', JSON.stringify(u));
        return u;
      });
    };
    const onUnmuteEvent = () => {
      setVoiceSettings(prev => {
        const u = { ...prev, voiceMuted: false };
        localStorage.setItem('srikar-voice-settings', JSON.stringify(u));
        return u;
      });
    };

    window.addEventListener('ai-voice-unlock', onUnlockEvent);
    window.addEventListener('ai-voice-mute',   onMuteEvent);
    window.addEventListener('ai-voice-unmute', onUnmuteEvent);

    // Attach click/touch listeners after 400ms so the loading-screen
    // progress animation doesn't accidentally trigger them
    const t = setTimeout(() => {
      window.addEventListener('click',      onAnyClick, { once: true });
      window.addEventListener('touchstart', onAnyClick, { once: true, passive: true });
      console.log('[INTRO] Listening for first page interaction...');
    }, 400);

    return () => {
      clearTimeout(t);
      window.removeEventListener('ai-voice-unlock', onUnlockEvent);
      window.removeEventListener('ai-voice-mute',   onMuteEvent);
      window.removeEventListener('ai-voice-unmute', onUnmuteEvent);
      window.removeEventListener('click',      onAnyClick);
      window.removeEventListener('touchstart', onAnyClick);
      if (synth.onvoiceschanged) synth.onvoiceschanged = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stopSpeaking is stable (useCallback with no deps that change)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (!open) {
      stopSpeaking();
    }
  }, [open, stopSpeaking]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    
    // Stop speaking immediately on new action/message
    stopSpeaking();

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      
      if (voiceSettings.autoPlayResponses) {
        speakText(data.reply);
      }
    } catch {
      const fallbackMsg = "I'm Srikar Merugu — AI Engineer & Full Stack Developer. I've built 3 AI SaaS products (CareerCopilot, InterviewMirror, FoodBridge), solved 170+ LeetCode problems, and I'm graduating from LPU in 2026. Ask me anything about my work or background!";
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
      
      if (voiceSettings.autoPlayResponses) {
        speakText(fallbackMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [messages, loading, voiceSettings.autoPlayResponses, speakText, stopSpeaking]);

  const handleRecruiterMode = async () => {
    stopSpeaking();
    setRecruiterMode(true);
    setRecruiterLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate a structured recruiter brief for Srikar in this exact format with emojis and clear sections:

🎯 PROFESSIONAL SUMMARY
[2-3 sentence summary]

⚡ CORE SKILLS
[bullet list of top 8 skills]

🚀 KEY PROJECTS
[3 project names with 1-line description each]

🏆 ACHIEVEMENTS
[3 bullet points]

🎓 EDUCATION
[degree and university]

📞 CONTACT
Email: srikarmerugu9381@gmail.com
Phone: +91 9381582458
Website: srikarmerugu.space`
          }],
        }),
      });
      const data = await res.json();
      setRecruiterData(data.reply);
      if (voiceSettings.autoPlayResponses) {
        speakText("I have compiled my professional recruiter brief. You can view all my core credentials, contact details, and project links below.");
      }
    } catch {
      const errorMsg = 'Error generating recruiter brief. Please try again.';
      setRecruiterData(errorMsg);
      if (voiceSettings.autoPlayResponses) {
        speakText(errorMsg);
      }
    } finally {
      setRecruiterLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating Trigger FAB ── */}
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Srikar AI"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <>
            <div className={styles.fabRing} />
            <div className={styles.fabAvatar}>S</div>
            <div className={styles.fabLabel}>Chat with Srikar AI</div>
          </>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`} role="dialog" aria-label="Srikar AI Chat">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarDot}>
              <span>S</span>
              <div className={`${styles.onlineDot} ${isSpeaking ? styles.speakingGlow : ''}`} />
            </div>
            <div>
              <div className={styles.headerName}>Srikar AI</div>
              <div className={styles.headerSub}>Digital Clone · Always Available</div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.recruiterBtn} ${recruiterMode ? styles.recruiterBtnActive : ''}`}
              onClick={handleRecruiterMode}
              title="Recruiter Brief"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Recruiter Mode
            </button>
          </div>
        </div>

        {/* ── Digital Twin 3D View & Waveform ── */}
        <div className={styles.digitalTwinSection}>
          <div className={styles.avatarContainer}>
            <DigitalTwin
              isSpeaking={isSpeaking}
              amplitude={amplitude}
              isMuted={voiceSettings.voiceMuted}
            />
          </div>
          <div className={styles.waveformContainer}>
            <WaveformVisualizer
              isSpeaking={isSpeaking}
              amplitude={amplitude}
              isMuted={voiceSettings.voiceMuted}
              analyser={analyserNode}
            />
          </div>

          {/* Quick Speech Playback Bar */}
          {isSpeaking && (
            <div className={styles.playbackControls}>
              <button onClick={togglePauseSpeech} className={styles.playbackBtn} title={isPaused ? 'Resume' : 'Pause'}>
                {isPaused ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M8 5v14l11-7z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                )}
              </button>
              <button onClick={() => handleSettingChange('voiceMuted', !voiceSettings.voiceMuted)} className={styles.playbackBtn} title={voiceSettings.voiceMuted ? 'Unmute' : 'Mute'}>
                {voiceSettings.voiceMuted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>
              <button onClick={stopSpeaking} className={styles.playbackBtn} title="Stop Speaking">
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M6 6h12v12H6z"/></svg>
              </button>
            </div>
          )}

          {/* Settings gear toggle */}
          <button
            className={`${styles.settingsToggle} ${showSettings ? styles.settingsToggleActive : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Configure Voice"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>

        {/* ── Voice Settings Panel ── */}
        {showSettings && (
          <div className={styles.settingsPanel}>
            <div className={styles.settingsHeader}>
              <span>🎙️ Voice Config Panel</span>
              <button onClick={() => setShowSettings(false)} className={styles.closeSettings}>✕</button>
            </div>
            
            <div className={styles.settingsBody}>
              <div className={styles.settingRow}>
                <label>TTS Engine Tier</label>
                <select
                  value={voiceSettings.voiceTier}
                  onChange={e => handleSettingChange('voiceTier', e.target.value as any)}
                >
                  <option value="tier3">Tier 3: ElevenLabs (Premium)</option>
                  <option value="tier2">Tier 2: OpenAI TTS (High Quality)</option>
                  <option value="tier1">Tier 1: Browser Speech (Built-in)</option>
                </select>
              </div>

              <div className={styles.settingRow}>
                <label>Voice Gender</label>
                <select
                  value={voiceSettings.voiceGender}
                  onChange={e => handleSettingChange('voiceGender', e.target.value as any)}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              {voiceSettings.voiceTier === 'tier1' && (
                <div className={styles.settingRow}>
                  <label>Browser Voice</label>
                  <select
                    value={voiceSettings.browserVoiceName}
                    onChange={e => handleSettingChange('browserVoiceName', e.target.value)}
                  >
                    <option value="">Default OS Voice</option>
                    {browserVoices.map(v => (
                      <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.settingRow}>
                <label>Volume: {Math.round(voiceSettings.voiceVolume * 100)}%</label>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={voiceSettings.voiceVolume}
                  onChange={e => handleSettingChange('voiceVolume', parseFloat(e.target.value))}
                />
              </div>

              <div className={styles.settingRow}>
                <label>Speech Speed: {voiceSettings.voiceSpeed}x</label>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={voiceSettings.voiceSpeed}
                  onChange={e => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                />
              </div>

              <div className={styles.settingToggles}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={voiceSettings.voiceMuted}
                    onChange={e => handleSettingChange('voiceMuted', e.target.checked)}
                  />
                  <span>Mute Voice</span>
                </label>
                
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={voiceSettings.autoPlayIntro}
                    onChange={e => handleSettingChange('autoPlayIntro', e.target.checked)}
                  />
                  <span>Autoplay Introduction</span>
                </label>
                
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={voiceSettings.autoPlayResponses}
                    onChange={e => handleSettingChange('autoPlayResponses', e.target.checked)}
                  />
                  <span>Autoplay Chat replies</span>
                </label>
              </div>

              <div className={styles.apiKeysHeader}>Self-provided keys (Optional override)</div>
              
              <div className={styles.settingRow}>
                <label>OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={voiceSettings.openAiApiKey}
                  onChange={e => handleSettingChange('openAiApiKey', e.target.value)}
                  className={styles.keyInput}
                />
              </div>

              <div className={styles.settingRow}>
                <label>ElevenLabs API Key</label>
                <input
                  type="password"
                  placeholder="xi-..."
                  value={voiceSettings.elevenLabsApiKey}
                  onChange={e => handleSettingChange('elevenLabsApiKey', e.target.value)}
                  className={styles.keyInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* Messages / Main view */}
        {!recruiterMode && (
          <>
            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
                  {msg.role === 'assistant' && (
                    <div className={styles.bubbleAvatar}>S</div>
                  )}
                  <div className={styles.bubbleText}>{msg.content}</div>
                </div>
              ))}

              {loading && (
                <div className={`${styles.bubble} ${styles.bubbleAI}`}>
                  <div className={styles.bubbleAvatar}>S</div>
                  <div className={styles.bubbleText}>
                    <div className={styles.typingDots}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className={styles.quickWrap}>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about Srikar..."
                disabled={loading}
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
        )}

        {/* Recruiter mode panel */}
        {recruiterMode && (
          <div className={styles.recruiterPanel}>
            <div className={styles.recruiterHeader}>
              <span>📋 Recruiter Brief</span>
              <button onClick={() => setRecruiterMode(false)} className={styles.closeRecruiter}>✕</button>
            </div>
            {recruiterLoading ? (
              <div className={styles.recruiterLoading}>
                <div className={styles.typingDots}><span /><span /><span /></div>
                Generating brief...
              </div>
            ) : (
              <div className={styles.recruiterContent}>
                <pre className={styles.recruiterText}>{recruiterData}</pre>
                <div className={styles.recruiterActions}>
                  <a href="mailto:srikarmerugu9381@gmail.com" className={styles.rAction}>
                    📧 Email Srikar
                  </a>
                  <a href="https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.rAction}>
                    📄 Resume
                  </a>
                  <a href="https://github.com/Srikar-Merugu" target="_blank" rel="noopener noreferrer" className={styles.rAction}>
                    💻 GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/srikar-merugu" target="_blank" rel="noopener noreferrer" className={styles.rAction}>
                    🔗 LinkedIn
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Powered by */}
        <div className={styles.poweredBy}>
          Powered by Claude · Srikar AI v2.0
        </div>
      </div>
    </>
  );
}
