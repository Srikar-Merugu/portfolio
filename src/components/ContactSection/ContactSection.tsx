'use client';

import { useEffect, useRef } from 'react';
import styles from './ContactSection.module.css';

const marqueeItems = [
  'ReactJS', '✦', 'Node.js', '✦',
  'Generative AI', '✦', 'OpenAI APIs', '✦',
  'MongoDB', '✦', 'Next.js', '✦',
  'Docker', '✦', 'AWS', '✦',
  'ReactJS', '✦', 'Node.js', '✦',
  'Generative AI', '✦', 'OpenAI APIs', '✦',
  'MongoDB', '✦', 'Next.js', '✦',
  'Docker', '✦', 'AWS', '✦',
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
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
          Available for new projects
        </div>

        <p className={styles.eyebrow} data-contact-anim>Get in touch</p>

        <h2 className={styles.bigHeading} data-contact-anim>
          Let&apos;s build<br />
          <span className={styles.bigHeadingItalic}>something</span><br />
          with AI
        </h2>

        <p className={styles.sub} data-contact-anim>
          Open to full-time roles, internships, freelance projects, and
          hackathon collaborations. If you&apos;re building something ambitious — let&apos;s talk.
        </p>

        <a
          href="mailto:srikarmerugu9381@gmail.com"
          className={styles.emailBtn}
          data-contact-anim
        >
          srikarmerugu9381@gmail.com
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
      <div className={styles.marqueeWrapper}>
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
          <a href="https://github.com/Srikar-Merugu" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
          <a href="https://www.linkedin.com/in/srikar-merugu" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
          <a href="https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Resume ↓</a>
          <a href="https://srikarmerugu.space" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Website</a>
          <a href="tel:+919381582458" className={styles.socialLink}>+91 93815 82458</a>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Srikar Merugu
        </p>
      </footer>
    </section>
  );
}
