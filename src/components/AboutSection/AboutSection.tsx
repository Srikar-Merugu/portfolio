'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutSection.module.css';

const skills = [
  { name: 'React / Next.js', level: 92 },
  { name: 'Node.js / Express', level: 88 },
  { name: 'Generative AI / OpenAI', level: 85 },
  { name: 'Python', level: 82 },
  { name: 'MongoDB / MySQL', level: 80 },
  { name: 'AWS / Docker / Cloud', level: 75 },
];

const education = [
  {
    title: '10th Grade · 10 CGPA',
    desc: 'Johnson Global High School — Perfect Score ✦',
    year: '2019',
    color: '#f5a623',
    icon: '🏫',
  },
  {
    title: 'Intermediate · 79.8%',
    desc: 'Narayana Junior College — MPC Stream',
    year: '2021',
    color: '#f5a623',
    icon: '📚',
  },
  {
    title: 'B.Tech — Computer Science',
    desc: 'Lovely Professional University · 2022–2026 · CGPA: 7.5',
    year: '2022',
    color: '#4a90d9',
    icon: '🎓',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const skillBarRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('[data-about-anim]', {
          opacity: 0, y: 32, stagger: 0.1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });

        skillBarRefs.current.forEach((bar, i) => {
          const level = parseInt(bar.dataset.level ?? '0', 10);
          gsap.to(bar, {
            width: `${level}%`, duration: 1.4, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 92%' },
          });
        });

        const portrait = sectionRef.current?.querySelector('[data-portrait]');
        if (portrait) {
          gsap.to(portrait, {
            yPercent: -8, ease: 'none',
            scrollTrigger: {
              trigger: portrait.parentElement,
              start: 'top bottom', end: 'bottom top', scrub: 1.5,
            },
          });
        }

        gsap.from('[data-edu-item]', {
          opacity: 0, y: 32, stagger: 0.15, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-edu-section]', start: 'top 82%' },
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

      {/* ── Two-column: bio + portrait ── */}
      <div className={styles.inner}>
        {/* Left */}
        <div className={styles.left}>
          <p className={styles.eyebrow} data-about-anim>About</p>
          <h2 className={styles.heading} data-about-anim>
            Built to<br />
            <span className={styles.headingItalic}>Ship</span>
          </h2>

          <p className={styles.bio} data-about-anim>
            I&apos;m <span className={styles.bioHighlight}>Srikar Merugu</span>, an AI Engineer
            and Full Stack Developer pursuing B.Tech in Computer Science at Lovely Professional
            University. I build scalable SaaS products and AI-powered applications that solve
            real problems — fast.
          </p>
          <p className={styles.bio} data-about-anim>
            My stack of choice is <span className={styles.bioHighlight}>ReactJS, Node.js, MongoDB, and OpenAI APIs</span>. I obsess
            over clean architecture, intuitive UX, and shipping products that people actually use —
            from zero to deployed on custom domains.
          </p>

          <div style={{ marginTop: 'clamp(32px, 5vh, 48px)' }} data-about-anim>
            <div className={styles.skillsGrid}>
              {skills.map((s, i) => (
                <div key={s.name} className={styles.skillItem}>
                  <p className={styles.skillName}>{s.name}</p>
                  <div className={styles.skillBar}>
                    <div
                      ref={(el) => { if (el) skillBarRefs.current[i] = el; }}
                      className={styles.skillBarFill}
                      data-level={s.level}
                      style={{ width: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.signature} data-about-anim>
            <div className={styles.sigLine} />
            <span className={styles.sigName}>Srikar Merugu</span>
          </div>
        </div>

        {/* Right — portrait only */}
        <div className={styles.right}>
          <div className={styles.portraitWrapper}>
            <video
              data-portrait
              className={styles.portraitVideo}
              src="/hero-video.mp4"
              autoPlay loop muted playsInline
            />
            <div className={styles.portraitLight} />
            <div className={styles.portraitFrame} />
          </div>
        </div>
      </div>

      {/* ── Education — full width below ── */}
      <div className={styles.educationSection} data-edu-section id="process">
        <div className={styles.educationHeader}>
          <div className={styles.educationDividerLine} />
          <h2 className={styles.educationHeading}>Education</h2>
          <div className={styles.educationDividerLine} />
        </div>

        <div className={styles.educationGrid}>
          {education.map((item) => (
            <div key={item.title} className={styles.educationCard} data-edu-item>
              <div className={styles.educationCardTop} style={{ borderColor: `${item.color}30` }}>
                <span className={styles.educationIcon}>{item.icon}</span>
                <span className={styles.educationYear} style={{ color: item.color }}>{item.year}</span>
              </div>
              <div className={styles.educationCardBody}>
                <div className={styles.educationDot} style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }} />
                <div>
                  <p className={styles.educationTitle}>{item.title}</p>
                  <p className={styles.educationDesc}>{item.desc}</p>
                </div>
              </div>
              <div className={styles.educationCardGlow} style={{ background: `radial-gradient(ellipse at top left, ${item.color}08, transparent 70%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
