'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.css';
import { profile, experience, achievements, education, certifications } from '@/data/profile';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('[data-about-anim]', {
          opacity: 0, y: 28, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });

        const portrait = sectionRef.current?.querySelector('[data-portrait]');
        if (portrait) {
          gsap.to(portrait, {
            yPercent: -6, ease: 'none',
            scrollTrigger: { trigger: portrait.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        }

        gsap.from('[data-col]', {
          opacity: 0, y: 28, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cols]', start: 'top 85%' },
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.section}>
      <div className={styles.separator} />
      <div className={styles.ambientOrb} />
      <div className={styles.ambientOrb2} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow} data-about-anim>About</p>
          <h2 className={styles.heading} data-about-anim>
            Built to <span className={styles.headingItalic}>Ship</span>
          </h2>

          <p className={styles.bio} data-about-anim>
            I&apos;m <span className={styles.bioHighlight}>{profile.name}</span>, a {profile.role} at{' '}
            <span className={styles.bioHighlight}>{profile.company}</span>. I recently graduated in Computer
            Science from Lovely Professional University, and I spend my days turning ideas into products that are
            live on real domains.
          </p>
          <p className={styles.bio} data-about-anim>
            On the AI side I build with <span className={styles.bioHighlight}>Claude, OpenAI and Gemini</span> —
            reading documents, scoring resumes, drafting messages, and keeping the maths in deterministic code where
            it belongs. At Kyro Studio I craft scroll-driven, multilingual websites for hospitality and brand
            clients with Next.js, GSAP and Supabase.
          </p>

          <ul className={styles.highlights} data-about-anim>
            {achievements.map((a) => (
              <li key={a} className={styles.highlight}>
                <span className={styles.highlightDot} />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <div className={styles.portraitWrapper}>
            <video
              data-portrait
              className={styles.portraitVideo}
              src="/hero-video.mp4"
              autoPlay loop muted playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className={styles.portraitLight} />
            <div className={styles.portraitFrame} />
          </div>
        </div>
      </div>

      {/* ── Experience / Education / Certifications ── */}
      <div className={styles.cols} data-cols>
        <div className={styles.col} data-col>
          <h3 className={styles.colHeading}>Experience</h3>
          {experience.map((e) => (
            <div key={e.org} className={styles.entry}>
              <div className={styles.entryTop}>
                <span className={styles.entryTitle}>{e.role}</span>
                <span className={styles.entryYear}>{e.period}</span>
              </div>
              <p className={styles.entryPlace}>{e.org}</p>
              <ul className={styles.entryPoints}>
                {e.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.col} data-col id="process">
          <h3 className={styles.colHeading}>Education</h3>
          {education.map((ed) => (
            <div key={ed.title} className={styles.entry}>
              <div className={styles.entryTop}>
                <span className={styles.entryTitle}>{ed.title}</span>
                <span className={styles.entryYear}>{ed.year}</span>
              </div>
              <p className={styles.entryPlace}>{ed.place} · {ed.detail}</p>
            </div>
          ))}
        </div>

        <div className={styles.col} data-col>
          <h3 className={styles.colHeading}>Certifications</h3>
          {certifications.map((c) => {
            const [name, issuer] = c.split(' — ');
            return (
              <div key={c} className={styles.entry}>
                <span className={styles.entryTitle}>{name}</span>
                {issuer && <p className={styles.entryPlace}>{issuer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
