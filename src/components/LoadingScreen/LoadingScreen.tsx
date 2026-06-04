'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'enter' | 'reveal'>('loading');
  const [displayText, setDisplayText] = useState('');
  const phrases = ['INITIALIZING AI SYSTEMS', 'LOADING NEURAL NETWORKS', 'RENDERING DIGITAL UNIVERSE', 'SYSTEM READY'];

  // Progress bar auto-fills to 100%, then shows Enter button
  useEffect(() => {
    let completed = false;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 4 + 1;
        if (next >= 100) {
          clearInterval(interval);
          if (!completed) {
            completed = true;
            Promise.resolve().then(() => setPhase('enter'));
          }
          return 100;
        }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const idx = Math.floor((progress / 100) * (phrases.length - 1));
    setDisplayText(phrases[Math.min(idx, phrases.length - 1)]);
  }, [progress]);

  // Called when user clicks "ENTER EXPERIENCE"
  // This is the REAL user gesture — dispatchEvent is synchronous,
  // so any audio API called inside a listener runs within gesture context.
  const handleEnter = () => {
    // Dispatch synchronously INSIDE the click → preserves gesture context
    window.dispatchEvent(new CustomEvent('audio-unlocked'));
    setPhase('reveal');
    setTimeout(onComplete, 800);
  };

  return (
    <div className={`${styles.screen} ${phase === 'reveal' ? styles.exit : ''}`}>
      <div className={styles.grid} />

      <div className={styles.center}>
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
          {phase === 'enter' ? 'ALL SYSTEMS ONLINE' : displayText}
        </div>

        {/* Progress bar — visible while loading */}
        {phase === 'loading' && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className={styles.progressNum}>{Math.min(Math.floor(progress), 100)}%</span>
          </div>
        )}

        {/* Enter button — replaces progress bar at 100% */}
        {phase === 'enter' && (
          <button
            className={styles.enterBtn}
            onClick={handleEnter}
            aria-label="Enter experience"
          >
            <span className={styles.enterBtnText}>ENTER EXPERIENCE</span>
            <span className={styles.enterBtnPulse} />
          </button>
        )}

        <div className={styles.scanLines} />
      </div>

      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      <div className={styles.versionTag}>PORTFOLIO OS v2.0 · AI EDITION</div>
    </div>
  );
}
