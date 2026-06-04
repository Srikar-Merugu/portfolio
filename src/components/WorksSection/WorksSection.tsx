'use client';

import { useEffect, useRef } from 'react';
import styles from './WorksSection.module.css';

const projects = [
  {
    id: '01',
    year: '2024',
    title: 'CareerCopilot AI',
    desc: 'AI-powered career guidance platform with resume analysis and personalized recommendations. Scalable SaaS architecture with full authentication workflows.',
    tags: ['ReactJS', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    accent: 'linear-gradient(135deg, rgba(245,166,35,0.18) 0%, rgba(255,100,20,0.08) 100%)',
    link: 'https://careercopilot-ai-pi.vercel.app/',
    screenshot: 'https://careercopilot-ai-pi.vercel.app/',
    color: '#f5a623',
    screenshotUrl: `https://api.screenshotone.com/take?url=https://careercopilot-ai-pi.vercel.app/&viewport_width=1200&viewport_height=630&format=jpg`,
    imgSrc: 'https://api.microlink.io/?url=https%3A%2F%2Fcareercopilot-ai-pi.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
  },
  {
    id: '02',
    year: '2024',
    title: 'InterviewMirror AI',
    desc: 'AI mock interview platform with resume scoring, analytics dashboards, and subscription workflows. Responsive SaaS UI with secure authentication.',
    tags: ['ReactJS', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Framer Motion'],
    accent: 'linear-gradient(135deg, rgba(74,144,217,0.18) 0%, rgba(30,60,100,0.08) 100%)',
    link: 'https://interview-mirror-ai-frontend.vercel.app/',
    color: '#4a90d9',
    imgSrc: 'https://api.microlink.io/?url=https%3A%2F%2Finterview-mirror-ai-frontend.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
  },
  {
    id: '03',
    year: '2024',
    title: 'FoodBridge AI',
    desc: 'Smart food donation platform connecting donors and NGOs with real-time tracking. Scalable REST APIs and responsive dashboards for efficient workflow management.',
    tags: ['ReactJS', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    accent: 'linear-gradient(135deg, rgba(100,200,80,0.15) 0%, rgba(20,60,20,0.07) 100%)',
    link: 'https://foodbridge-ai-gamma.vercel.app/',
    color: '#4ade80',
    imgSrc: 'https://api.microlink.io/?url=https%3A%2F%2Ffoodbridge-ai-gamma.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle2',
  },
];

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from(headerRef.current?.querySelectorAll('[data-anim]') ?? [], {
          opacity: 0, y: 36, stagger: 0.12, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        });

        const cards = gridRef.current?.querySelectorAll('[data-card]') ?? [];
        gsap.from(cards, {
          opacity: 0, y: 48, stagger: 0.1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        });

        const counters = sectionRef.current?.querySelectorAll('[data-count]') ?? [];
        counters.forEach((el) => {
          const target = parseInt((el as HTMLElement).dataset.count ?? '0', 10);
          gsap.from(el, {
            innerText: 0, duration: 1.8, ease: 'power2.out', snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: 'top 90%' },
            onUpdate() {
              const v = Math.round(parseFloat((el as HTMLElement).innerText));
              (el as HTMLElement).innerText = v + ((el as HTMLElement).dataset.suffix ?? '');
            },
          });
        });
      }, sectionRef);

      cleanup = () => ctx.revert();
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} id="works" className={styles.section}>
      <div className={styles.sectionGlow} />

      <div ref={headerRef} className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow} data-anim>Selected Work</p>
          <h2 className={styles.heading} data-anim>
            Crafted<br />
            <span className={styles.headingItalic}>Projects</span>
          </h2>
        </div>
        <a
          href="https://github.com/Srikar-Merugu"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewAll}
          data-anim
        >
          Full archive ↗
        </a>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.card} data-card>
            {/* Project screenshot preview */}
            <div className={styles.cardPreview} style={{ borderColor: `${p.color}30` }}>
              <div className={styles.browserBar}>
                <span className={styles.browserDot} style={{ background: '#ff5f57' }} />
                <span className={styles.browserDot} style={{ background: '#febc2e' }} />
                <span className={styles.browserDot} style={{ background: '#28c840' }} />
                <span className={styles.browserUrl}>{p.link.replace('https://', '')}</span>
              </div>
              <div className={styles.screenshotArea} style={{ background: p.accent, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={p.imgSrc}
                  alt={p.title + ' screenshot'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                    borderRadius: '0 0 4px 4px',
                  }}
                  onError={(e) => {
                    // Fallback to SVG preview if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const svg = target.nextElementSibling as HTMLElement;
                    if (svg) svg.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                  <ProjectPreview id={p.id} color={p.color} title={p.title} />
                </div>
              </div>
            </div>

            <div className={styles.cardBody}>
              {/* Header row */}
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardYear}>{p.year}</p>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                </div>
                <a
                  href={p.link}
                  className={styles.cardArrow}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.title}`}
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12L12 2M12 2H5M12 2V9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <p className={styles.cardDesc}>{p.desc}</p>

              <div className={styles.cardFooter}>
                <div className={styles.cardTags}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.cardTag} style={{ borderColor: `${p.color}30`, color: `${p.color}cc` }}>{t}</span>
                  ))}
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className={styles.liveBtn} style={{ background: `${p.color}18`, borderColor: `${p.color}40`, color: p.color }}>
                  <span className={styles.liveDot} style={{ background: p.color }} />
                  Live Demo
                </a>
              </div>
            </div>

            <span className={styles.cardNumber}>{p.id}</span>
          </div>
        ))}
      </div>

      {/* Counter strip */}
      <div className={styles.counterStrip}>
        {[
          { n: 3,    suffix: '',  label: 'AI SaaS Products' },
          { n: 170,  suffix: '+', label: 'LeetCode Solved' },
          { n: 200,  suffix: '+', label: 'GFG Problems' },
          { n: 2026, suffix: '',  label: 'B.Tech Graduating' },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: 'contents' }}>
            <div className={styles.counterItem}>
              <span className={styles.counterNum} data-count={item.n} data-suffix={item.suffix}>
                {item.n}{item.suffix}
              </span>
              <span className={styles.counterLabel}>{item.label}</span>
            </div>
            {i < arr.length - 1 && <div className={styles.counterDivider} />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Inline project preview illustrations ── */
function ProjectPreview({ id, color, title }: { id: string; color: string; title: string }) {
  if (id === '01') return (
    <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="480" height="260" fill="#0a0a0f" />
      {/* Sidebar */}
      <rect x="0" y="0" width="120" height="260" fill="#111118" />
      <rect x="16" y="20" width="88" height="8" rx="4" fill={color} fillOpacity="0.7" />
      <rect x="16" y="38" width="70" height="6" rx="3" fill="white" fillOpacity="0.12" />
      {[0,1,2,3,4].map(i => <rect key={i} x="16" y={62 + i * 24} width="88" height="6" rx="3" fill="white" fillOpacity={i === 0 ? 0.3 : 0.08} />)}
      {/* Main content */}
      <rect x="136" y="20" width="200" height="12" rx="4" fill="white" fillOpacity="0.25" />
      <rect x="136" y="40" width="140" height="7" rx="3" fill="white" fillOpacity="0.1" />
      {/* Cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={136 + i * 110} y="65" width="100" height="70" rx="8" fill={color} fillOpacity={0.08} stroke={color} strokeOpacity={0.2} strokeWidth="1" />
          <rect x={144 + i * 110} y="75" width="50" height="6" rx="3" fill={color} fillOpacity="0.5" />
          <rect x={144 + i * 110} y="89" width="80" height="5" rx="2" fill="white" fillOpacity="0.12" />
          <rect x={144 + i * 110} y="100" width="60" height="5" rx="2" fill="white" fillOpacity="0.08" />
          <rect x={144 + i * 110} y="118" width="40" height="10" rx="5" fill={color} fillOpacity="0.4" />
        </g>
      ))}
      {/* Progress bar */}
      <rect x="136" y="155" width="320" height="8" rx="4" fill="white" fillOpacity="0.06" />
      <rect x="136" y="155" width="200" height="8" rx="4" fill={color} fillOpacity="0.6" />
      <text x="136" y="182" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace">Resume Analysis · AI Recommendations · Career Score</text>
    </svg>
  );

  if (id === '02') return (
    <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="480" height="260" fill="#080c14" />
      {/* Header */}
      <rect x="0" y="0" width="480" height="44" fill="#0d1525" />
      <rect x="16" y="14" width="100" height="8" rx="4" fill={color} fillOpacity="0.7" />
      <rect x="360" y="12" width="80" height="22" rx="11" fill={color} fillOpacity="0.2" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
      <text x="380" y="27" fill={color} fillOpacity="0.8" fontSize="9" fontFamily="sans-serif">Start Mock</text>
      {/* Interview panel */}
      <rect x="16" y="58" width="220" height="140" rx="8" fill="#0d1525" stroke={color} strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="56" cy="90" r="20" fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
      <text x="48" y="95" fill={color} fontSize="14" fontFamily="sans-serif">AI</text>
      <rect x="80" y="82" width="140" height="7" rx="3" fill="white" fillOpacity="0.2" />
      <rect x="80" y="96" width="110" height="5" rx="2" fill="white" fillOpacity="0.1" />
      {[0,1,2].map(i => <rect key={i} x="24" y={116 + i * 22} width={160 + i * 20} height="6" rx="3" fill="white" fillOpacity="0.08" />)}
      {/* Score panel */}
      <rect x="252" y="58" width="212" height="140" rx="8" fill="#0d1525" stroke={color} strokeOpacity="0.15" strokeWidth="1" />
      <text x="266" y="80" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">SCORE ANALYSIS</text>
      {['Communication', 'Technical', 'Confidence'].map((label, i) => (
        <g key={label}>
          <text x="266" y={102 + i * 30} fill="white" fillOpacity="0.3" fontSize="8" fontFamily="sans-serif">{label}</text>
          <rect x="266" y={108 + i * 30} width="180" height="6" rx="3" fill="white" fillOpacity="0.05" />
          <rect x="266" y={108 + i * 30} width={[140, 160, 110][i]} height="6" rx="3" fill={color} fillOpacity="0.5" />
        </g>
      ))}
    </svg>
  );

  return (
    <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="480" height="260" fill="#060f08" />
      {/* Map placeholder */}
      <rect x="240" y="0" width="240" height="260" fill="#0a1a0c" />
      {[0,1,2,3].map(i => <circle key={i} cx={280 + i * 40} cy={80 + i * 30} r={8 + i * 3} fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.4" strokeWidth="1" />)}
      <polyline points="280,80 320,110 360,95 400,125" fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Left panel */}
      <rect x="0" y="0" width="228" height="260" fill="#060f08" />
      <rect x="16" y="20" width="130" height="10" rx="4" fill={color} fillOpacity="0.7" />
      <rect x="16" y="40" width="90" height="6" rx="3" fill="white" fillOpacity="0.15" />
      {/* Donor cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="16" y={62 + i * 60} width="196" height="50" rx="6" fill={color} fillOpacity="0.06" stroke={color} strokeOpacity="0.15" strokeWidth="1" />
          <circle cx="38" cy={87 + i * 60} r="12" fill={color} fillOpacity="0.2" />
          <rect x="56" y={78 + i * 60} width="80" height="6" rx="3" fill="white" fillOpacity="0.2" />
          <rect x="56" y={90 + i * 60} width="60" height="5" rx="2" fill="white" fillOpacity="0.1" />
          <rect x="150" y={82 + i * 60} width="50" height="16" rx="8" fill={color} fillOpacity={0.3 - i * 0.05} />
        </g>
      ))}
      <text x="16" y="248" fill={color} fillOpacity="0.5" fontSize="8" fontFamily="monospace">Real-time tracking · Donor ↔ NGO · AI Matching</text>
    </svg>
  );
}
