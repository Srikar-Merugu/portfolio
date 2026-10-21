'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './VideoIntro.module.css';
import { profile, stats } from '@/data/profile';

const CinematicLayer = dynamic(
  () => import('@/components/CinematicLayer/CinematicLayer'),
  { ssr: false }
);

/* ─── SVG Icons ───────────────────────────────────────────────────── */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const MuteIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);

/* ─── Component ──────────────────────────────────────────────────── */
export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  // ── Autoplay muted (allowed by every browser); sound is opt-in ──────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The video may already be ready before hydration attached onCanPlay.
    if (v.readyState >= 3) setVideoLoaded(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.muted = true;
    v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, []);

  // ── Play once, then settle into the idle state ────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleEnded = () => {
      setIntroFinished(true);
      setIsPlaying(false);
      ambientRef.current?.pause();
    };
    v.addEventListener('ended', handleEnded);
    return () => v.removeEventListener('ended', handleEnded);
  }, []);

  // ── Entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const runAnimation = async () => {
      const { gsap } = await import('gsap');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const d = reduce ? 0 : 1;
      const tl = gsap.timeline({ delay: 0.15 * d });
      tl.to(`.${styles.tagLine}`,    { opacity: 1, y: 0, duration: 1.0 * d, ease: 'power3.out' }, 0.1 * d);
      tl.to(`.${styles.nameFirst}`,  { opacity: 1, y: 0, duration: 1.2 * d, ease: 'power4.out' }, 0.25 * d);
      tl.to(`.${styles.nameLast}`,   { opacity: 1, y: 0, duration: 1.2 * d, ease: 'power4.out' }, 0.4 * d);
      tl.to(`.${styles.role}`,       { opacity: 1, y: 0, duration: 0.9 * d, ease: 'power3.out' }, 0.6 * d);
      tl.to(`.${styles.statsRow}`,   { opacity: 1, y: 0, duration: 0.8 * d, ease: 'power3.out' }, 0.75 * d);
      tl.to(`.${styles.ctaRow}`,     { opacity: 1, y: 0, duration: 0.8 * d, ease: 'power3.out' }, 0.85 * d);
      tl.to(`.${styles.statusBadge}`,{ opacity: 1, y: 0, duration: 0.7 * d, ease: 'power3.out' }, 0.95 * d);
      tl.to(controlsRef.current,     { opacity: 1, duration: 0.6 * d, ease: 'power2.out' }, 0.9 * d);
      tl.to(scrollRef.current,       { opacity: 1, duration: 0.6 * d, ease: 'power2.out' }, 1.1 * d);
    };
    runAnimation();
  }, []);

  // ── Video handlers ────────────────────────────────────────────────
  const handleVideoLoaded = useCallback(() => setVideoLoaded(true), []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause(); a?.pause();
      setIsPlaying(false);
    } else {
      if (introFinished) { v.currentTime = 0; setIntroFinished(false); }
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      a?.play().catch(() => {});
    }
  }, [isPlaying, introFinished]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
    if (!next && (v.paused || v.ended)) {
      if (v.ended) { v.currentTime = 0; setIntroFinished(false); }
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isMuted]);

  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={styles.hero}>
      <div className={styles.letterboxTop} />
      <div className={styles.letterboxBottom} />

      {/* Ambient blurred background video — always muted, loops */}
      <video
        ref={ambientRef}
        className={`${styles.ambientBg} ${videoLoaded ? styles.ambientBgVisible : ''}`}
        src="/hero-video.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        aria-hidden="true"
      />

      {/* Foreground video — muted autoplay; visitor can turn sound on */}
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={`${styles.heroVideo} ${videoLoaded ? styles.heroVideoVisible : ''} ${introFinished ? styles.heroVideoIdle : ''}`}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          onCanPlay={handleVideoLoaded}
          aria-label="Intro video of Srikar"
        />
      </div>

      <div className={styles.gradientLeft} />
      <div className={styles.gradientTop} />
      <div className={styles.gradientBottom} />
      <div className={styles.vignette} />
      <div className={styles.grain} aria-hidden="true" />
      <CinematicLayer />

      <div className={styles.content}>
        <p className={styles.tagLine}>{profile.role} · {profile.company}</p>

        <div className={styles.nameWrapper}>
          <h1 className={styles.nameFirst}>
            {profile.firstName}
            <span className={styles.srOnly}> {profile.lastName}</span>
          </h1>
          <p className={styles.nameLast} aria-hidden="true">{profile.lastName}</p>
        </div>

        <p className={styles.role}>
          I build <span className={styles.roleHighlight}>AI products</span> with Claude &amp; OpenAI, and
          cinematic, multilingual websites for clients at {profile.company}.
        </p>

        <div className={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statNumber}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={() => scrollToId('works')}>
            <span>View Projects</span>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <path d="M2 12L12 2M12 2H5M12 2V9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.ctaSecondary} onClick={() => scrollToId('contact')}>
            <span>Contact Me</span>
          </button>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
            <span>GitHub</span>
          </a>
          <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
            <span>Resume ↗</span>
          </a>
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          {profile.availability}
        </div>
      </div>

      <div ref={controlsRef} className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Turn video sound on' : 'Mute video'}
          aria-pressed={!isMuted}
          title={isMuted ? 'Sound on' : 'Mute'}
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
        <button
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <button
        ref={scrollRef}
        className={styles.scrollIndicator}
        onClick={() => scrollToId('works')}
        aria-label="Scroll to projects"
      >
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </button>
    </section>
  );
}
