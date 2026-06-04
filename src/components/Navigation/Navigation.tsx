'use client';

import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';

const sections = [
  { label: 'Work',   id: 'works' },
  { label: 'Skills', id: 'skills' },
  { label: 'About',  id: 'about' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const ids = ['works','skills','about','contact'];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) {
          setActive(id);
          return;
        }
      }
      setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.logo}>S.<span>M</span></div>

      <div className={styles.links}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`${styles.link} ${active === s.id ? styles.linkActive : ''}`}
            onClick={() => scrollTo(s.id)}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <a
          href="https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeLink}
        >
          Resume ↓
        </a>
        <button
          className={styles.cta}
          onClick={() => scrollTo('contact')}
          style={{ background: 'none', border: '1px solid rgba(245,166,35,0.35)', cursor: 'none' }}
        >
          Hire Me
        </button>
      </div>
    </nav>
  );
}
