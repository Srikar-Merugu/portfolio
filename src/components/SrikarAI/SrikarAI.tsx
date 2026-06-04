'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SrikarAI.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  content: "Hey! I'm Srikar's AI clone. Ask me anything about his skills, projects, background, or why he'd be a great hire. I'm here to help! 🚀",
};

export default function SrikarAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [recruiterData, setRecruiterData] = useState<string | null>(null);
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasOpened = useRef(false);

  // ── Web Speech: speak intro on first open ────────────────────────
  const speakIntro = () => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel(); // clear any pending
    const utter = new SpeechSynthesisUtterance(
      "Hey! I'm Srikar's AI clone. Ask me anything about his skills, projects, or background. I'm here to help!"
    );
    utter.rate = 1.05;
    utter.pitch = 1;
    utter.volume = 1;
    // Prefer a natural English voice if available
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utter.voice = preferred;
    synth.speak(utter);
  };

  useEffect(() => {
    if (open && !hasOpened.current) {
      hasOpened.current = true;
      // Voices may not be loaded yet on first call — wait for them
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
      if (synth) {
        if (synth.getVoices().length > 0) {
          speakIntro();
        } else {
          synth.addEventListener('voiceschanged', speakIntro, { once: true });
        }
      }
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    // Stop speaking when panel is closed
    if (!open && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
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
      // Speak the reply
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(data.reply);
        utter.rate = 1.05;
        utter.pitch = 1;
        utter.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
          v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel'))
        ) || voices.find(v => v.lang.startsWith('en'));
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Having a brief moment of difficulty. Please try again!",
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleRecruiterMode = async () => {
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
    } catch {
      setRecruiterData('Error generating recruiter brief. Please try again.');
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
      {/* ── Floating Trigger Button ── */}
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
              <div className={styles.onlineDot} />
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
              title="Recruiter Mode"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Recruiter Mode
            </button>
          </div>
        </div>

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

        {/* Messages */}
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

        {/* Powered by */}
        <div className={styles.poweredBy}>
          Powered by Claude · Srikar AI v1.0
        </div>
      </div>
    </>
  );
}
