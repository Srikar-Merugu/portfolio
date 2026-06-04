'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'reveal'>('loading');
  const [displayText, setDisplayText] = useState('');
  const phrases = ['INITIALIZING AI SYSTEMS', 'LOADING NEURAL NETWORKS', 'RENDERING DIGITAL UNIVERSE', 'WELCOME'];

  useEffect(() => {
    // Increment progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase('ready');
          return 100;
        }
        return p + Math.random() * 4 + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Cycle through phrases
  useEffect(() => {
    const show = () => {
      const idx = Math.floor((progress / 100) * (phrases.length - 1));
      setDisplayText(phrases[Math.min(idx, phrases.length - 1)]);
    };
    show();
  }, [progress]);

  const handleEnter = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Unlock Audio Context
    const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;
    if (AudioContextClass) {
      try {
        const audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        // Play silent sound
        const source = audioCtx.createBufferSource();
        source.buffer = audioCtx.createBuffer(1, 1, 22050);
        source.connect(audioCtx.destination);
        source.start(0);
        console.log('Audio Context Unlocked');
      } catch (err) {
        console.error('AudioContext unlock failed:', err);
      }
    }
    // Unlock Web Speech API
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (synth) {
      try {
        const utter = new SpeechSynthesisUtterance('');
        synth.speak(utter);
      } catch (err) {
        console.error('SpeechSynthesis unlock failed:', err);
      }
    }

    // Fire global event to notify the voice engine that experience was entered
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('experience-entered'));
    }

    setPhase('reveal');
    setTimeout(onComplete, 1000);
  };

  return (
    <div
      className={`${styles.screen} ${phase === 'reveal' ? styles.exit : ''} ${phase === 'ready' ? styles.readyScreen : ''}`}
      onClick={phase === 'ready' ? () => handleEnter() : undefined}
    >
      {/* Grid overlay */}
      <div className={styles.grid} />

      {/* Center content */}
      <div className={styles.center}>
        {/* Logo mark */}
        <div className={styles.logoMark}>
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="rgba(245,166,35,0.3)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="26" stroke="rgba(245,166,35,0.5)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="4" fill="#f5a623" />
            <line x1="40" y1="4" x2="40" y2="20" stroke="#f5a623" strokeWidth="1" />
            <line x1="40" y1="60" x2="40" y2="76" stroke="#f5a623" strokeWidth="1" />
            <line x1="4" y1="40" x2="20" y2="40" stroke="#f5a623" strokeWidth="1" />
            <line x1="60" y1="40" x2="76" y2="40" stroke="#f5a623" strokeWidth="1" />
            <path d="M40 14 L46 40 L40 66 L34 40 Z" fill="rgba(245,166,35,0.1)" stroke="rgba(245,166,35,0.4)" strokeWidth="0.5" />
          </svg>
        </div>

        <div className={styles.nameBlock}>
          <div className={styles.nameFirst}>SRIKAR</div>
          <div className={styles.nameLast}>MERUGU</div>
        </div>

        <div className={styles.statusText}>
          {phase === 'ready' ? 'SYSTEMS ONLINE & SECURED' : displayText}
        </div>

        {/* Progress bar or click to enter */}
        {phase === 'loading' ? (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className={styles.progressNum}>{Math.min(Math.floor(progress), 100)}%</span>
          </div>
        ) : (
          <div className={styles.enterContainer}>
            <button className={styles.enterBtn} onClick={(e) => handleEnter(e)}>
              ENTER EXPERIENCE
            </button>
            <div className={styles.subPrompt}>or click anywhere to enter</div>
          </div>
        )}

        {/* Scan lines decoration */}
        <div className={styles.scanLines} />
      </div>

      {/* Corner brackets */}
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      {/* Version tag */}
      <div className={styles.versionTag}>PORTFOLIO OS v2.0 · AI EDITION</div>
    </div>
  );
}
