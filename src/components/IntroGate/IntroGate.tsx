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

export default function IntroGate() {
  const [state, setState] = useState<'open' | 'closing' | 'closed'>('open');
  const enterRef = useRef<HTMLButtonElement>(null);

  const close = (sound: boolean) => {
    if (state !== 'open') return;
    startIntro(sound);
    setState('closing');
    setTimeout(() => setState('closed'), 700);
  };

  useEffect(() => {
    if (state !== 'open') return;
    enterRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state === 'closed') return null;

  return (
    <div
      className={`${styles.gate} ${state === 'closing' ? styles.gateClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-gate-name"
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.role}>{profile.role} · {profile.company}</p>
        <h2 id="intro-gate-name" className={styles.name}>
          {profile.firstName} <span>{profile.lastName}</span>
        </h2>
        <button ref={enterRef} className={styles.enter} onClick={() => close(true)}>
          <span className={styles.enterIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z" /></svg>
          </span>
          Enter with sound
        </button>
        <button className={styles.skip} onClick={() => close(false)}>
          Skip — continue muted
        </button>
      </div>
    </div>
  );
}
