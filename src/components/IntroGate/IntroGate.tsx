'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './IntroGate.module.css';
import { profile } from '@/data/profile';

export type IntroStartDetail = { sound: boolean };

// Browsers only let a page play audio after the visitor interacts with it.
// This screen collects that one click, then tells the hero video to start
// from the beginning. The event is dispatched synchronously inside the click
// handler so the video's play() call still counts as user-initiated.
export function startIntro(sound: boolean) {
  (window as unknown as { __introStart?: IntroStartDetail }).__introStart = { sound };
  window.dispatchEvent(new CustomEvent<IntroStartDetail>('intro-start', { detail: { sound } }));
}

const PHRASES = ['INITIALIZING AI SYSTEMS', 'LOADING NEURAL NETWORKS', 'RENDERING DIGITAL UNIVERSE', 'SYSTEM READY'];
const MIN_LOAD_MS = 1500; // the bar never fills faster than this, even from cache
const MAX_LOAD_MS = 8000; // give up waiting on a slow network and let them in

export default function IntroGate() {
  const [phase, setPhase] = useState<'loading' | 'enter' | 'closing' | 'closed'>('loading');
  const [progress, setProgress] = useState(0);
  const enterRef = useRef<HTMLButtonElement>(null);

  // ── Progress follows how much of the intro video has downloaded ──────
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('video[data-hero-video]');
    const started = performance.now();
    let target = 0;
    let shown = 0;
    let raf = 0;

    const measure = () => {
      if (!video) return;
      if (video.readyState >= 4) { target = 100; return; } // HAVE_ENOUGH_DATA
      if (video.duration && video.buffered.length) {
        const end = video.buffered.end(video.buffered.length - 1);
        target = Math.max(target, Math.min(99, (end / video.duration) * 100));
      }
    };
    const onReady = () => { target = 100; };
    video?.addEventListener('progress', measure);
    video?.addEventListener('canplaythrough', onReady);

    const tick = (now: number) => {
      const elapsed = now - started;
      measure();
      if (!video || elapsed > MAX_LOAD_MS) target = 100;
      // Ease toward the real target, capped so a full bar takes MIN_LOAD_MS.
      const cap = (elapsed / MIN_LOAD_MS) * 100;
      shown = Math.min(cap, shown + (target - shown) * 0.12 + 0.4, target);
      setProgress(shown);
      if (shown >= 99.9) {
        setProgress(100);
        setPhase('enter');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video?.removeEventListener('progress', measure);
      video?.removeEventListener('canplaythrough', onReady);
    };
  }, []);

  const close = (sound: boolean) => {
    if (phase !== 'enter' && phase !== 'loading') return;
    startIntro(sound);
    setPhase('closing');
    setTimeout(() => setPhase('closed'), 800);
  };

  // Lock scrolling while the screen is up; Esc enters without sound.
  useEffect(() => {
    if (phase === 'closing' || phase === 'closed') return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase === 'enter') enterRef.current?.focus();
  }, [phase]);

  if (phase === 'closed') return null;

  const phrase = phase === 'loading'
    ? PHRASES[Math.min(Math.floor((progress / 100) * (PHRASES.length - 1)), PHRASES.length - 1)]
    : 'ALL SYSTEMS ONLINE';

  return (
    <div
      className={`${styles.screen} ${phase === 'closing' ? styles.exit : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${profile.name} — portfolio intro`}
    >
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.center}>
        <div className={styles.logoMark} aria-hidden="true">
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

        <h2 className={styles.nameBlock}>
          <span className={styles.nameFirst}>{profile.firstName.toUpperCase()}</span>
          <span className={styles.nameLast}>{profile.lastName.toUpperCase()}</span>
        </h2>

        <p key={phrase} className={styles.statusText} aria-live="polite">{phrase}</p>

        {phase === 'loading' ? (
          <div className={styles.progressWrap} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressNum}>{Math.floor(progress)}%</span>
          </div>
        ) : (
          <div className={styles.enterContainer}>
            <button ref={enterRef} className={styles.enterBtn} onClick={() => close(true)}>
              <span className={styles.enterBtnText}>Enter Experience</span>
              <span className={styles.enterBtnPulse} aria-hidden="true" />
            </button>
            <button className={styles.muteLink} onClick={() => close(false)}>
              or enter without sound
            </button>
          </div>
        )}
      </div>

      <div className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

      <div className={styles.versionTag} aria-hidden="true">PORTFOLIO OS v3.0 · AI EDITION</div>
    </div>
  );
}
