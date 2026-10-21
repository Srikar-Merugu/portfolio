'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './WorksSection.module.css';
import { projects, profile, type Project, type ProjectCategory } from '@/data/profile';

const FILTERS: ('All' | ProjectCategory)[] = ['All', 'AI Products', 'Client Work', 'Mobile'];

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const featured = useMemo(() => projects.filter((p) => p.featured), []);
  const visible = useMemo(
    () => projects.filter((p) => !p.featured && (filter === 'All' || p.category === filter)),
    [filter],
  );
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f, f === 'All' ? projects.length : projects.filter((p) => p.category === f).length])),
    [],
  );

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const init = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current?.querySelectorAll('[data-anim]') ?? [], {
          opacity: 0, y: 28, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        });
        gsap.utils.toArray<HTMLElement>('[data-featured]').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 40, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
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
            Things I&apos;ve<br />
            <span className={styles.headingItalic}>Shipped</span>
          </h2>
        </div>
        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={styles.viewAll} data-anim>
          All code on GitHub
        </a>
      </div>

      {/* ── Featured projects ── */}
      <div className={styles.featuredList}>
        {featured.map((p, i) => (
          <article key={p.slug} className={`${styles.featured} ${i % 2 ? styles.featuredReverse : ''}`} data-featured>
            <a
              href={p.live ?? p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.featuredMedia}
              style={{ ['--accent' as string]: p.color }}
              aria-label={`Open ${p.title}`}
            >
              <BrowserFrame project={p} />
            </a>
            <div className={styles.featuredBody}>
              <div className={styles.metaRow}>
                <span className={styles.metaCategory} style={{ color: p.color }}>{p.category}</span>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
                <span className={styles.metaYear}>{p.year}</span>
              </div>
              <h3 className={styles.featuredTitle}>{p.title}</h3>
              <p className={styles.featuredDesc}>{p.desc}</p>
              <Tags tags={p.tags} />
              <ProjectLinks project={p} />
            </div>
          </article>
        ))}
      </div>

      {/* ── Filterable grid ── */}
      <div className={styles.filterBar} role="tablist" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className={styles.filterCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((p) => (
          <article key={p.slug} className={styles.card} style={{ ['--accent' as string]: p.color }}>
            <a
              href={p.live ?? p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardMedia}
              aria-label={`Open ${p.title}`}
              tabIndex={-1}
            >
              <BrowserFrame project={p} compact />
            </a>
            <div className={styles.cardBody}>
              <div className={styles.metaRow}>
                <span className={styles.metaCategory} style={{ color: p.color }}>{p.category}</span>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <Tags tags={p.tags} />
              <ProjectLinks project={p} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className={styles.tags} aria-label="Tech stack">
      {tags.map((t) => <li key={t} className={styles.tag}>{t}</li>)}
    </ul>
  );
}

function ProjectLinks({ project: p }: { project: Project }) {
  return (
    <div className={styles.links}>
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className={styles.liveBtn}>
          <span className={styles.liveDot} />
          Live site
        </a>
      )}
      {p.repo && (
        <a href={p.repo} target="_blank" rel="noopener noreferrer" className={styles.codeBtn}>
          Code ↗
        </a>
      )}
    </div>
  );
}

function BrowserFrame({ project: p, compact }: { project: Project; compact?: boolean }) {
  const host = (p.live ?? p.repo ?? '').replace(/^https?:\/\/(www\.)?/, '');
  return (
    <div className={`${styles.frame} ${compact ? styles.frameCompact : ''}`}>
      <div className={styles.browserBar}>
        <span className={styles.browserDot} style={{ background: '#ff5f57' }} />
        <span className={styles.browserDot} style={{ background: '#febc2e' }} />
        <span className={styles.browserDot} style={{ background: '#28c840' }} />
        <span className={styles.browserUrl}>{host}</span>
      </div>
      <div className={styles.screen}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" decoding="async" />
        ) : (
          <Placeholder project={p} />
        )}
      </div>
    </div>
  );
}

// For projects without a live site (Android apps, retired deployments).
function Placeholder({ project: p }: { project: Project }) {
  const isMobile = p.category === 'Mobile';
  return (
    <div className={styles.placeholder} style={{ ['--accent' as string]: p.color }}>
      {isMobile ? (
        <div className={styles.phone}>
          <div className={styles.phoneNotch} />
          <div className={styles.phoneTitle}>{p.title}</div>
          {[70, 90, 55, 80].map((w, i) => <div key={i} className={styles.phoneLine} style={{ width: `${w}%` }} />)}
          <div className={styles.phoneButton} />
        </div>
      ) : (
        <div className={styles.placeholderText}>
          <span className={styles.placeholderTitle}>{p.title}</span>
          <span className={styles.placeholderSub}>{p.live ? 'Visit live site' : 'Source on GitHub'}</span>
        </div>
      )}
    </div>
  );
}
