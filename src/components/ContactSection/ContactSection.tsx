'use client';

import { useEffect, useRef } from 'react';
import styles from './ContactSection.module.css';
import { profile } from '@/data/profile';

const MARQUEE = ['Claude API', 'Next.js', 'TypeScript', 'GSAP', 'Supabase', 'Postgres', 'Node.js', 'Kotlin', 'OpenAI', 'Tailwind'];
// Duplicated once so the CSS loop (translateX -50%) is seamless.
const marqueeItems = [...MARQUEE, ...MARQUEE].flatMap((t) => [t, '✦']);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('[data-contact-anim]', {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className={styles.separator} />
      <div className={styles.orb} />

      {/* ── CTA Block ── */}
      <div className={styles.ctaBlock}>
        <div className={styles.badge} data-contact-anim>
          <span className={styles.badgeDot} />
          {profile.availability}
        </div>

        <p className={styles.eyebrow} data-contact-anim>Get in touch</p>

        <h2 className={styles.bigHeading} data-contact-anim>
          Let&apos;s build<br />
          <span className={styles.bigHeadingItalic}>something</span><br />
          with AI
        </h2>

        <p className={styles.sub} data-contact-anim>
          Currently building at {profile.company}. Open to full-time roles, freelance builds and
          hackathon collaborations — if you&apos;re building something ambitious, let&apos;s talk.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className={styles.emailBtn}
          data-contact-anim
        >
          {profile.email}
          <span className={styles.emailArrow}>
            <svg viewBox="0 0 14 14">
              <path
                d="M2 12L12 2M12 2H5M12 2V9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>

      {/* ── Marquee ── */}
      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item === '✦' ? <span>{item}</span> : item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          S.<span>M</span>
        </div>

        <div className={styles.socials}>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
          <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Resume</a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className={styles.socialLink}>{profile.phone}</a>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </section>
  );
}
