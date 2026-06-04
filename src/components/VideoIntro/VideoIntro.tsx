'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './VideoIntro.module.css';

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

/* ─── Component ──────────────────────────────────────────────────── */
export default function VideoIntro() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  // ── Play-once: stop after intro finishes, don't loop ─────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleEnded = () => {
      setIntroFinished(true);
      setIsPlaying(false);
      if (ambientRef.current) ambientRef.current.pause();
    };

    v.addEventListener('ended', handleEnded);
    return () => v.removeEventListener('ended', handleEnded);
  }, []);

  // ── GSAP entrance animations ──────────────────────────────────────
  useEffect(() => {
    const runAnimation = async () => {
      const { gsap } = await import('gsap');
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(`.${styles.tagLine}`,    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.5);
      tl.to(`.${styles.nameFirst}`,  { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' }, 0.7);
      tl.to(`.${styles.nameLast}`,   { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' }, 0.9);
      tl.to(`.${styles.role}`,       { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 1.1);
      tl.to(`.${styles.statsRow}`,   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.3);
      tl.to(`.${styles.ctaRow}`,     { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.45);
      tl.to(`.${styles.statusBadge}`,{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.6);
      tl.to(controlsRef.current,     { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.5);
      tl.to(scrollRef.current,       { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.8);
    };
    runAnimation();
  }, []);

  // ── Custom cursor ──────────────────────────────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;
    if (!cursor || !ring) return;

    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const animateRing = () => {
      const rx = parseFloat(ring.style.left || '0');
      const ry = parseFloat(ring.style.top || '0');
      ring.style.left = `${rx + (ringX - rx) * 0.12}px`;
      ring.style.top = `${ry + (ringY - ry) * 0.12}px`;
      raf = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animateRing);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Video handlers ────────────────────────────────────────────────
  const handleVideoLoaded = useCallback(() => setVideoLoaded(true), []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause(); a?.pause();
    } else {
      if (introFinished) { v.currentTime = 0; setIntroFinished(false); }
      v.play(); a?.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, introFinished]);

  const handleScrollClick = useCallback(() => {
    const next = document.getElementById('next-section') || document.getElementById('works');
    next?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorRingRef} className="cursor-ring" />

      <section ref={heroRef} className={styles.hero}>
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
          preload="auto"
          aria-hidden="true"
          loop
        />

        {/* Foreground video — muted autoplay, plays once then idles */}
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={`${styles.heroVideo} ${videoLoaded ? styles.heroVideoVisible : ''} ${introFinished ? styles.heroVideoIdle : ''}`}
            src="/hero-video.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlay={handleVideoLoaded}
          />
        </div>

        <div className={styles.gradientLeft} />
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
        <div className={styles.vignette} />
        <div className={styles.grain} aria-hidden="true" />
        <CinematicLayer />

        {/* Portfolio content */}
        <div ref={contentRef} className={styles.content}>
          <p className={styles.tagLine}>AI Engineer &amp; Full Stack Developer</p>

          <div className={styles.nameWrapper}>
            <h1 className={styles.nameFirst}>Srikar</h1>
            <h1 className={styles.nameLast}>Merugu</h1>
          </div>

          <p className={styles.role}>
            Building{' '}
            <span className={styles.roleHighlight}>AI-powered SaaS products</span>
            {' '}with React, Node.js &amp; cloud technologies.
            <br />
            Generative AI · Full-Stack · Scalable Platforms
          </p>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>AI Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>170+</span>
              <span className={styles.statLabel}>LeetCode</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>200+</span>
              <span className={styles.statLabel}>GFG Problems</span>
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button
              className={styles.ctaPrimary}
              onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>View Projects</span>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                <path d="M2 12L12 2M12 2H5M12 2V9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="mailto:srikarmerugu9381@gmail.com" className={styles.ctaSecondary}>
              <span>Contact Me</span>
            </a>
            <a href="https://github.com/Srikar-Merugu" target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
              <span>GitHub</span>
            </a>
            <a href="https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.ctaGhost}>
              <span>Resume ↓</span>
            </a>
          </div>

          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            Open to Opportunities · Available Now
          </div>
        </div>

        {/* Play/Pause only — no mute button */}
        <div ref={controlsRef} className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        {/* Intro finished overlay */}
        {introFinished && (
          <div className={styles.introEndOverlay}>
            <button className={styles.replayBtn} onClick={togglePlay} aria-label="Replay intro">
              <PlayIcon />
              <span>Replay</span>
            </button>
          </div>
        )}

        <button
          ref={scrollRef as React.RefObject<HTMLButtonElement>}
          className={styles.scrollIndicator}
          onClick={handleScrollClick}
          aria-label="Scroll to next section"
        >
          <span className={styles.scrollText}>Scroll</span>
          <div className={styles.scrollLine} />
        </button>
      </section>
    </>
  );
}
