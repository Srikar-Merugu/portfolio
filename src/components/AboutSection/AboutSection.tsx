'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.css';
import { profile, experience, achievements, education, certifications } from '@/data/profile';

const FACTS = [
  { label: 'Currently', value: `${profile.role}, ${profile.company}` },
  { label: 'Focus', value: 'AI products · cinematic web' },
  { label: 'Based in', value: profile.location },
  { label: 'Open to', value: 'Full-time & freelance' },
];

type TimelineItem = { kind: 'work' | 'edu'; period: string; title: string; place: string; points?: string[] };

const TIMELINE: TimelineItem[] = [
  ...experience.map((e) => ({ kind: 'work' as const, period: e.period, title: e.role, place: e.org, points: e.points })),
  ...education.map((ed) => ({ kind: 'edu' as const, period: ed.year, title: ed.title, place: `${ed.place} · ${ed.detail}` })),
];

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

          <dl className={styles.facts} data-about-anim>
            {FACTS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.aboutCtas} data-about-anim>
            <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
              View resume ↗
            </a>
            <a href="#contact" className={styles.ctaGhost}>Let&apos;s talk</a>
          </div>
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

      {/* ── Journey: timeline + certifications ── */}
      <div className={styles.journey} data-cols>
        <div className={styles.journeyHead} data-col>
          <p className={styles.eyebrow}>Journey</p>
          <h3 className={styles.journeyHeading}>
            From classroom to <span className={styles.headingItalic}>client work</span>
          </h3>
        </div>

        <div className={styles.journeyGrid}>
          <ol className={styles.timeline} data-col>
            {TIMELINE.map((t) => (
              <li key={t.title} className={`${styles.tItem} ${t.kind === 'work' ? styles.tItemWork : ''}`}>
                <span className={styles.tDot} aria-hidden="true" />
                <div className={styles.tMeta}>
                  <span className={styles.tYear}>{t.period}</span>
                  <span className={styles.tKind}>{t.kind === 'work' ? 'Work' : 'Education'}</span>
                </div>
                <div className={styles.tBody}>
                  <h4 className={styles.tTitle}>{t.title}</h4>
                  <p className={styles.tPlace}>{t.place}</p>
                  {t.points && (
                    <ul className={styles.tPoints}>
                      {t.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <aside className={styles.certs} data-col>
            <h4 className={styles.certsHeading}>Certifications</h4>
            {certifications.map((c) => {
              const [name, issuer] = c.split(' — ');
              return (
                <div key={c} className={styles.cert}>
                  <span className={styles.certBadge} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="9" r="5" />
                      <path d="M9 13.5 8 21l4-2 4 2-1-7.5" />
                    </svg>
                  </span>
                  <div>
                    <p className={styles.certName}>{name}</p>
                    {issuer && <p className={styles.certIssuer}>{issuer}</p>}
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    </section>
  );
}
