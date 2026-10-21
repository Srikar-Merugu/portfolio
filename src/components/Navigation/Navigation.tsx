'use client';

import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';
import { profile } from '@/data/profile';

const sections = [
  { label: 'Work',    id: 'works' },
  { label: 'Skills',  id: 'skills' },
  { label: 'About',   id: 'about' },
  { label: 'Contact', id: 'contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      for (const { id } of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) {
          setActive(id);
          return;
        }
      }
      setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${scrolled || menuOpen ? styles.navScrolled : ''}`} aria-label="Main">
      <button className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        S.<span>M</span>
      </button>

      <div className={styles.links}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`${styles.link} ${active === s.id ? styles.linkActive : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <a href={profile.links.resume} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
          Resume ↗
        </a>
        <button className={styles.cta} onClick={() => scrollTo('contact')}>
          Hire Me
        </button>
        <button
          className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span />
        </button>
      </div>

      <div id="mobile-menu" className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} hidden={!menuOpen}>
        {sections.map((s, i) => (
          <button
            key={s.id}
            className={styles.mobileLink}
            style={{ transitionDelay: `${i * 0.05}s` }}
            onClick={() => scrollTo(s.id)}
          >
            <span className={styles.mobileIndex}>0{i + 1}</span>
            {s.label}
          </button>
        ))}
        <div className={styles.mobileFooter}>
          <a href={profile.links.resume} target="_blank" rel="noopener noreferrer">Resume ↗</a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </nav>
  );
}
