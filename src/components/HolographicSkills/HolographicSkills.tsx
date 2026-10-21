'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HolographicSkills.module.css';
import { skillGroups } from '@/data/profile';
import { SKILL_ICONS } from './skillIcons';

function Icon({ name }: { name: string }) {
  const icon = SKILL_ICONS[name];
  if (!icon) return <span className={styles.skillDot} />;
  if (icon.kind === 'brand') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill={icon.color}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {icon.paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export default function HolographicSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} ${visible ? styles.visible : ''}`} id="skills">
      <div className={styles.sectionGlow} />

      <div className={styles.header}>
        <p className={styles.eyebrow}>Toolkit</p>
        <h2 className={styles.heading}>
          Skills &amp; <span className={styles.headingItalic}>Stack</span>
        </h2>
        <p className={styles.headingSub}>What I reach for when I build — from LLM pipelines to scroll-driven frontends.</p>
      </div>

      <div className={styles.groupGrid}>
        {skillGroups.map((group, gi) => (
          <div
            key={group.label}
            className={styles.categoryGroup}
            style={{ '--accent': group.color, '--delay': `${gi * 0.07}s` } as React.CSSProperties}
          >
            <div className={styles.categoryLabel}>
              <span className={styles.categoryLine} />
              {group.label}
              <span className={styles.categoryCount}>{group.items.length}</span>
            </div>
            <ul className={styles.skillsRow}>
              {group.items.map((name) => (
                <li key={name} className={styles.skillCard}>
                  <span className={styles.skillIcon}>
                    <Icon name={name} />
                  </span>
                  <span className={styles.skillName}>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
