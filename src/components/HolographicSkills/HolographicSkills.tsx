'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HolographicSkills.module.css';

/* ── All skills with SVG logos inline ── */
const allSkills = [
  // AI / ML
  { name: 'Generative AI',   category: 'AI/ML',      color: '#f5a623', icon: '🤖' },
  { name: 'OpenAI APIs',     category: 'AI/ML',      color: '#f5a623', icon: '⚡' },
  { name: 'Prompt Eng.',     category: 'AI/ML',      color: '#f5a623', icon: '💬' },
  { name: 'LLM Apps',        category: 'AI/ML',      color: '#f5a623', icon: '🧠' },
  // Frontend
  { name: 'React',           category: 'Frontend',   color: '#61dafb', icon: 'react' },
  { name: 'Next.js',         category: 'Frontend',   color: '#ffffff', icon: 'next' },
  { name: 'Tailwind CSS',    category: 'Frontend',   color: '#38bdf8', icon: 'tailwind' },
  { name: 'Framer Motion',   category: 'Frontend',   color: '#bb7af7', icon: '✦' },
  { name: 'HTML5',           category: 'Frontend',   color: '#e34c26', icon: 'html' },
  { name: 'CSS3',            category: 'Frontend',   color: '#2965f1', icon: 'css' },
  // Backend
  { name: 'Node.js',         category: 'Backend',    color: '#68a063', icon: 'node' },
  { name: 'Express.js',      category: 'Backend',    color: '#a0a0a0', icon: '⚙️' },
  { name: 'Python',          category: 'Backend',    color: '#3572A5', icon: 'python' },
  { name: 'REST APIs',       category: 'Backend',    color: '#a0a0a0', icon: '🔌' },
  { name: 'Java',            category: 'Backend',    color: '#b07219', icon: '☕' },
  { name: 'PHP',             category: 'Backend',    color: '#777bb3', icon: '🐘' },
  // Database
  { name: 'MongoDB',         category: 'Database',   color: '#4db33d', icon: 'mongo' },
  { name: 'MySQL',           category: 'Database',   color: '#4479a1', icon: 'mysql' },
  // Cloud & Tools
  { name: 'AWS',             category: 'Cloud',      color: '#ff9900', icon: 'aws' },
  { name: 'Docker',          category: 'Cloud',      color: '#0db7ed', icon: 'docker' },
  { name: 'Git / GitHub',    category: 'Cloud',      color: '#f34f29', icon: 'git' },
  { name: 'Vercel',          category: 'Cloud',      color: '#ffffff', icon: '▲' },
  { name: 'Figma',           category: 'Cloud',      color: '#f24e1e', icon: '🎨' },
  { name: 'Postman',         category: 'Cloud',      color: '#ff6c37', icon: '📬' },
];

const categoryColors: Record<string, string> = {
  'AI/ML':    '#f5a623',
  'Frontend': '#61dafb',
  'Backend':  '#68a063',
  'Database': '#4db33d',
  'Cloud':    '#ff9900',
};

/* ── Tech SVG logos ── */
function SkillIcon({ icon, color }: { icon: string; color: string }) {
  const s = { width: 22, height: 22 };
  switch (icon) {
    case 'react': return (
      <svg {...s} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.5" fill={color} />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.2" fill="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={color} strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
      </svg>
    );
    case 'next': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 9h-6z" />
      </svg>
    );
    case 'tailwind': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    );
    case 'node': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M12 1.85c-.27 0-.55.07-.78.2L3.78 6.35c-.48.28-.78.8-.78 1.36v9.58c0 .56.3 1.08.78 1.36l7.44 4.3c.23.13.5.2.78.2.28 0 .55-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36L12.78 2.05c-.23-.13-.5-.2-.78-.2z" />
      </svg>
    );
    case 'python': return (
      <svg {...s} viewBox="0 0 24 24">
        <path fill="#3572A5" d="M12 2C8.5 2 8 3.5 8 3.5V7h4v1H5.5S3 7.8 3 11.5s2.2 4 2.2 4H7v-2s-.1-2.2 2.2-2.2h5.6s2.2.1 2.2-2V5.2S16.5 2 12 2z"/>
        <path fill="#FFC331" d="M12 22c3.5 0 4-1.5 4-1.5V17h-4v-1h6.5s2.5.2 2.5-3.5-2.2-4-2.2-4H17v2s.1 2.2-2.2 2.2H9.2S7 12.6 7 14.8v3.8S7.5 22 12 22z"/>
      </svg>
    );
    case 'mongo': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.095-1.662-.197-2.218z"/>
      </svg>
    );
    case 'mysql': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.062-.14a.526.526 0 0 0-.2-.151zM5.97 20.096c-.204 0-.408.003-.604.01-.195.01-.389.02-.583.04l-.018.003v.018l.003.008c.014.193.043.384.078.577.054.24.12.48.197.718l.007.021.014.008c.137.063.28.12.429.168.15.05.304.09.46.122l.023.003.014-.016.007-.015c-.01-.053-.025-.1-.037-.153a2.3 2.3 0 0 1-.063-.456l-.002-.057.052.015c.128.04.261.07.396.094.26.043.524.06.79.053.26-.004.52-.03.776-.076a3.7 3.7 0 0 0 .724-.213c.028-.013.055-.025.083-.036l-.003.024c-.018.12-.04.238-.063.356a6.65 6.65 0 0 1-.12.484l-.007.026.012.013c.127.095.264.18.407.252.143.073.29.136.44.19.148.054.298.097.45.13.147.034.297.059.448.073l.024.003.016-.018.003-.015c-.007-.075-.015-.15-.025-.225a3.56 3.56 0 0 1-.048-.465c.004-.154.023-.308.06-.46.035-.15.088-.296.155-.437.068-.14.15-.275.245-.406.095-.13.202-.255.32-.37z"/>
      </svg>
    );
    case 'aws': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.240-.024-.304-.08-.063-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.055-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.063-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.503 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.574-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" />
      </svg>
    );
    case 'docker': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M13.98 11.08h2.12v-2h-2.12v2zm-2.95 0h2.12v-2h-2.12v2zm-2.95 0h2.12v-2H8.08v2zm-2.95 0h2.12v-2H5.13v2zm5.9-2.95h2.12v-2h-2.12v2zm-2.95 0h2.12v-2H8.08v2zm-2.95 0h2.12v-2H5.13v2zm-2.95 0H4.3v-2H2.18v2zm16.84 2.95h2.12v-2h-2.12v2zm-2.95 0h2.12v-2h-2.12v2zm-.9-2.95h2.12v-2h-2.12v2zm0 0"/>
      </svg>
    );
    case 'git': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.604-.403-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" />
      </svg>
    );
    case 'html': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
      </svg>
    );
    case 'css': return (
      <svg {...s} viewBox="0 0 24 24" fill={color}>
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414v-.001z" />
      </svg>
    );
    default: return <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>;
  }
}

export default function HolographicSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = ['AI/ML', 'Frontend', 'Backend', 'Database', 'Cloud'];

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      <div className={styles.sectionGlow} />

      {/* Header */}
      <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
        <p className={styles.eyebrow}>Technical Arsenal</p>
        <h2 className={styles.heading}>
          Skills &amp;<br />
          <span className={styles.headingItalic}>Expertise</span>
        </h2>
        <p className={styles.headingSub}>Every tool I ship with — no filters, no tabs.</p>
      </div>

      {/* All skills grouped by category */}
      {categories.map((cat) => {
        const catSkills = allSkills.filter(s => s.category === cat);
        const catColor = categoryColors[cat];
        return (
          <div key={cat} className={`${styles.categoryGroup} ${visible ? styles.visible : ''}`}>
            <div className={styles.categoryLabel} style={{ color: catColor }}>
              <span className={styles.categoryLine} style={{ background: catColor }} />
              {cat}
            </div>
            <div className={styles.skillsRow}>
              {catSkills.map((skill, i) => (
                <div
                  key={skill.name}
                  className={`${styles.skillCard} ${visible ? styles.skillCardVisible : ''}`}
                  style={{
                    '--delay': `${i * 0.06}s`,
                    '--accent': skill.color,
                    borderColor: `${skill.color}22`,
                  } as React.CSSProperties}
                >
                  <div className={styles.skillIcon}>
                    <SkillIcon icon={skill.icon} color={skill.color} />
                  </div>
                  <span className={styles.skillName}>{skill.name}</span>
                  <div className={styles.skillGlow} style={{ background: skill.color }} />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom stat bar */}
      <div className={`${styles.statBar} ${visible ? styles.visible : ''}`}>
        {[
          { n: '6+', label: 'Languages' },
          { n: '10+', label: 'Frameworks' },
          { n: '5+', label: 'Cloud Tools' },
          { n: '3', label: 'AI Products' },
        ].map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statNum}>{s.n}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
