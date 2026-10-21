import {
  siClaude, siGooglegemini, siReact, siNextdotjs, siTypescript, siTailwindcss, siGsap,
  siFramer, siThreedotjs, siNodedotjs, siExpress, siOpenapiinitiative, siZod, siPython,
  siOpenjdk, siLaravel, siPostgresql, siSupabase, siMongodb, siMysql, siFirebase, siKotlin,
  siAndroid, siJetpackcompose, siVercel, siDocker, siGithub, siFigma, siPostman,
  type SimpleIcon,
} from 'simple-icons';

/* Logo for each skill in src/data/profile.ts (keyed by the skill name).
   Brand marks come from simple-icons; skills without a brand mark use a
   small line icon drawn here. */

export type SkillIcon =
  | { kind: 'brand'; path: string; color: string }
  | { kind: 'line'; paths: string[] };

// Near-black brand colours (Next.js, Vercel, GitHub…) disappear on the dark
// background, so render those in the site's text colour instead.
function brand(icon: SimpleIcon): SkillIcon {
  const hex = icon.hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return { kind: 'brand', path: icon.path, color: luminance < 0.25 ? '#f0ede8' : `#${hex}` };
}

const line = (...paths: string[]): SkillIcon => ({ kind: 'line', paths });

export const SKILL_ICONS: Record<string, SkillIcon> = {
  // AI & LLMs
  'Claude API': brand(siClaude),
  // OpenAI is not in simple-icons — a hexagonal "spark" stands in for it.
  'OpenAI API': line('M12 2.5 20.2 7.25v9.5L12 21.5l-8.2-4.75v-9.5Z', 'M12 7.5v9M7.5 12h9'),
  Gemini: brand(siGooglegemini),
  'Prompt Engineering': line('M4 5h16v11H8l-4 4Z', 'M8 9.5l2 1.5-2 1.5', 'M12 12.5h4'),
  'LLM Apps': line('M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8Z', 'M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z'),
  'OCR / Document AI': line('M4 8V5a1 1 0 0 1 1-1h3', 'M16 4h3a1 1 0 0 1 1 1v3', 'M20 16v3a1 1 0 0 1-1 1h-3', 'M8 20H5a1 1 0 0 1-1-1v-3', 'M8 9h8M8 12h8M8 15h5'),

  // Frontend
  React: brand(siReact),
  'Next.js': brand(siNextdotjs),
  TypeScript: brand(siTypescript),
  'Tailwind CSS': brand(siTailwindcss),
  GSAP: brand(siGsap),
  'Framer Motion': brand(siFramer),
  Lenis: line('M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z', 'M12 8v8', 'M9.5 13.5 12 16l2.5-2.5'),
  'Three.js': brand(siThreedotjs),

  // Backend
  'Node.js': brand(siNodedotjs),
  Express: brand(siExpress),
  'REST APIs': brand(siOpenapiinitiative),
  BullMQ: line('M4 6h16M4 12h16M4 18h10', 'M18 16l2 2-2 2'),
  Zod: brand(siZod),
  Python: brand(siPython),
  Java: brand(siOpenjdk),
  'PHP / Laravel': brand(siLaravel),

  // Data
  'PostgreSQL (Neon)': brand(siPostgresql),
  Supabase: brand(siSupabase),
  MongoDB: brand(siMongodb),
  MySQL: brand(siMysql),
  Firebase: brand(siFirebase),

  // Mobile
  Kotlin: brand(siKotlin),
  Android: brand(siAndroid),
  'Jetpack Compose': brand(siJetpackcompose),

  // Cloud & tools
  Vercel: brand(siVercel),
  AWS: { kind: 'brand', path: 'M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.240-.024-.304-.08-.063-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.055-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.063-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.503 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.574-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z', color: '#ff9900' },
  Docker: brand(siDocker),
  'Git / GitHub': brand(siGithub),
  Figma: brand(siFigma),
  Postman: brand(siPostman),
};
