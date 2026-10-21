/* ─────────────────────────────────────────────────────────────────────
   Single source of truth for portfolio content.
   Every section of the site AND the Srikar AI system prompt read from
   this file — update it here and everything stays in sync.
   ───────────────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Srikar Merugu',
  firstName: 'Srikar',
  lastName: 'Merugu',
  role: 'Full Stack & AI Engineer',
  company: 'Kyro Studio',
  tagline: 'I build AI products and cinematic web experiences that ship.',
  summary:
    'Full Stack & AI Engineer at Kyro Studio. I build AI-powered SaaS products with Claude and OpenAI, and scroll-driven, multilingual websites for hospitality and brand clients — from idea to a live domain.',
  location: 'India',
  availability: 'Open to full-time roles & freelance projects',
  email: 'srikarmerugu9381@gmail.com',
  phone: '+91 9381582458',
  website: 'https://www.srikarmerugu.space',
  links: {
    github: 'https://github.com/Srikar-Merugu',
    linkedin: 'https://www.linkedin.com/in/srikar-merugu',
    resume: 'https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing',
  },
};

export type ProjectCategory = 'AI Products' | 'Client Work' | 'Mobile';

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: ProjectCategory;
  featured?: boolean;
  badge?: string;
  desc: string;
  tags: string[];
  color: string;
  live?: string;
  repo?: string;
  image?: string;
}

export const projects: Project[] = [
  // ── AI products ────────────────────────────────────────────────────
  {
    slug: 'billshield',
    title: 'BillShield',
    year: '2026',
    category: 'AI Products',
    featured: true,
    badge: '100x Engineers Hackathon',
    desc: "Turn a bill you don't trust into one message worth sending. Upload a bill photo or PDF and what you were promised — Claude reads every line, deterministic code checks the maths and tax, points at the line that doesn't add up, and drafts the message to send the company.",
    tags: ['Next.js', 'TypeScript', 'Claude API', 'Neon Postgres', 'Vercel Blob', 'Zod'],
    color: '#f5a623',
    live: 'https://billshield-two.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/billshield',
    image: '/projects/billshield.jpg',
  },
  {
    slug: 'linkedin-manager-ai',
    title: 'LinkedIn Manager AI',
    year: '2026',
    category: 'AI Products',
    desc: 'AI LinkedIn growth platform: onboarding analyses your resume, LinkedIn PDF and GitHub, then an AI content coach, content studio, calendar, publishing center and analytics dashboard help you plan and post.',
    tags: ['Next.js', 'TypeScript', 'Express', 'BullMQ', 'JWT', 'Framer Motion'],
    color: '#0a95ff',
    repo: 'https://github.com/Srikar-Merugu/LinkedIn-Manager-Ai',
  },
  {
    slug: 'promptcompiler',
    title: 'PromptCompiler',
    year: '2026',
    category: 'AI Products',
    desc: 'Turns any project idea into three production-grade AI prompts — Plan, Build, Optimize. Auto-detects the domain, supports three depth levels and tunes output for Claude, ChatGPT, Gemini or Cursor.',
    tags: ['JavaScript', 'Express', 'OpenAI API', 'Prompt Engineering'],
    color: '#a78bfa',
    live: 'https://prompt-compiler-lime.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/PromptCompiler',
    image: '/projects/promptcompiler.jpg',
  },
  {
    slug: 'careercopilot',
    title: 'CareerCopilot AI',
    year: '2026',
    category: 'AI Products',
    desc: 'AI career copilot with resume analysis, AI job matching, interview prep and personalised recommendations, on a scalable SaaS architecture with full authentication.',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    color: '#fb923c',
    live: 'https://careercopilot-ai-pi.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/careercopilot-ai',
    image: '/projects/careercopilot.jpg',
  },
  {
    slug: 'interviewmirror',
    title: 'InterviewMirror AI',
    year: '2026',
    category: 'AI Products',
    desc: 'AI mock interview and career-prep platform with real-time feedback, resume scoring, analytics dashboards and subscription workflows.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion'],
    color: '#4a90d9',
    live: 'https://interview-mirror-ai-frontend.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/InterviewMirror-AI',
    image: '/projects/interviewmirror.jpg',
  },
  {
    slug: 'foodbridge',
    title: 'FoodBridge AI',
    year: '2026',
    category: 'AI Products',
    desc: 'Geospatial food-recovery platform that uses AI matching to route surplus food from donors to NGOs, with real-time tracking and dashboards.',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    color: '#4ade80',
    live: 'https://foodbridge-ai-gamma.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/foodbridge-ai',
  },
  {
    slug: 'leadforge',
    title: 'LeadForge AI',
    year: '2026',
    category: 'AI Products',
    desc: 'B2B lead-generation SaaS that collects business leads from Google Business Profiles, web scrapers, email extractors and social channels, with Excel export.',
    tags: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'xlsx'],
    color: '#22d3ee',
    live: 'https://lead-generate-three.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/Lead-generate',
    image: '/projects/leadforge.jpg',
  },

  // ── Kyro Studio client work ────────────────────────────────────────
  {
    slug: 'rotyi',
    title: 'Rotyi Bisztró',
    year: '2026',
    category: 'Client Work',
    featured: true,
    badge: 'Kyro Studio',
    desc: "Casual bistro demo (Brief 3, Budapest): a fictional District VII bistro built for Kyro Studio's hospitality demos, in Hungarian and English. Design language adapted from the CRAV concept site (structure, motion and UX patterns only); all copy, illustrations, name and palette are original. Includes a table-booking API wired to Supabase and Resend.",
    tags: ['Next.js 16', 'TypeScript', 'Tailwind 4', 'GSAP', 'Supabase', 'i18n'],
    color: '#e8553d',
    live: 'https://rotyi-bistro.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/Rotyi-bistro',
    image: '/projects/rotyi.jpg',
  },
  {
    slug: 'konoba',
    title: 'Konoba Plavi Kamen',
    year: '2026',
    category: 'Client Work',
    badge: 'Kyro Studio',
    desc: 'Luxury coastal fish restaurant demo on the island of Cres, Croatia, in Croatian, English and German with translated slugs. Scroll-driven hero where the dish sinks behind the wave, lazy-loaded video and online table booking.',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind 4', 'GSAP', 'Lenis', 'Supabase'],
    color: '#38bdf8',
    live: 'https://luxury-coastal-konoba.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/Luxury-Coastal-konoba',
    image: '/projects/konoba.jpg',
  },
  {
    slug: 'villa-v',
    title: 'Villa Sérénité',
    year: '2026',
    category: 'Client Work',
    badge: 'Kyro Studio',
    desc: 'Cinematic real-estate site that tells the construction journey of a luxury custom villa through scroll-driven storytelling.',
    tags: ['Next.js', 'TypeScript', 'GSAP', 'Lenis', 'Framer Motion'],
    color: '#d6b98c',
    live: 'https://villa-v.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/Villa-V',
    image: '/projects/villa-v.jpg',
  },
  {
    slug: 'kyro-drink',
    title: 'KYRO Drink',
    year: '2026',
    category: 'Client Work',
    badge: 'Kyro Studio',
    desc: 'Product landing page for a sparkling natural-energy drink, with bold motion, smooth scrolling and playful interactions.',
    tags: ['Next.js', 'TypeScript', 'GSAP', 'Lenis', 'Framer Motion'],
    color: '#c6f432',
    live: 'https://kyro-drink-landing-page.vercel.app',
    repo: 'https://github.com/Srikar-Merugu/Kyro-Drink-LandingPage',
    image: '/projects/kyro-drink.jpg',
  },

  // ── Mobile ─────────────────────────────────────────────────────────
  {
    slug: 'taskmind',
    title: 'TaskMind AI',
    year: '2026',
    category: 'Mobile',
    desc: 'Android productivity app with a Gemini-powered AI mentor that understands your tasks, auto-generates subtasks and chats in real time. Clean Architecture + MVVM with Firebase auth and sync.',
    tags: ['Kotlin', 'Android', 'Firebase', 'Gemini', 'MVVM'],
    color: '#7f52ff',
    repo: 'https://github.com/Srikar-Merugu/TaskMind-AI',
  },
  {
    slug: 'lokal-auth',
    title: 'Lokal Auth App',
    year: '2026',
    category: 'Mobile',
    desc: 'Production-quality Email + OTP authentication app: real emails over SMTP, 6-digit OTPs with 60-second expiry and 3-attempt limit, live session timer and event analytics.',
    tags: ['Kotlin', 'Jetpack Compose', 'Clean Architecture', 'Timber'],
    color: '#3ddc84',
    repo: 'https://github.com/Srikar-Merugu/Lokal-Auth-App',
  },
];

export const experience = [
  {
    role: 'Full Stack & AI Engineer',
    org: 'Kyro Studio',
    period: '2026 — Present',
    points: [
      'Design and build scroll-driven, multilingual websites for hospitality and brand clients (Next.js, GSAP, Lenis, Supabase).',
      'Ship booking flows, email and push notifications, and SEO-ready i18n routing.',
      'Build AI features and internal tools on the Claude and OpenAI APIs.',
    ],
  },
];

export const achievements = [
  'Built BillShield for the 100x Engineers C8 hackathon',
  `${projects.filter((x) => x.live).length} projects live on production domains`,
  `${projects.filter((x) => x.category === 'Mobile').length} Android apps built with Kotlin`,
  'Perfect 10 CGPA in 10th grade',
];

export const education = [
  { title: 'B.Tech — Computer Science', place: 'Lovely Professional University', detail: 'CGPA 7.5', year: '2022 — 2026' },
  { title: 'Intermediate (MPC)', place: 'Narayana Junior College', detail: '79.8%', year: '2021' },
  { title: '10th Grade', place: 'Johnson Global High School', detail: '10 CGPA', year: '2019' },
];

export const certifications = [
  'Full Stack Web Development — Udemy',
  'Data Structures and Algorithms — Techvanto Academy',
  'Master in JavaScript and React.js — Google Developer Club, LPU',
];

export const skillGroups: { label: string; color: string; items: string[] }[] = [
  { label: 'AI & LLMs', color: '#f5a623', items: ['Claude API', 'OpenAI API', 'Gemini', 'Prompt Engineering', 'LLM Apps', 'OCR / Document AI'] },
  { label: 'Frontend', color: '#61dafb', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Framer Motion', 'Lenis', 'Three.js'] },
  { label: 'Backend', color: '#68a063', items: ['Node.js', 'Express', 'REST APIs', 'BullMQ', 'Zod', 'Python', 'Java', 'PHP / Laravel'] },
  { label: 'Data', color: '#4db33d', items: ['PostgreSQL (Neon)', 'Supabase', 'MongoDB', 'MySQL', 'Firebase'] },
  { label: 'Mobile', color: '#a78bfa', items: ['Kotlin', 'Android', 'Jetpack Compose'] },
  { label: 'Cloud & Tools', color: '#ff9900', items: ['Vercel', 'AWS', 'Docker', 'Git / GitHub', 'Figma', 'Postman'] },
];

export const stats = [
  { value: String(projects.filter((x) => x.live).length), label: 'Live products' },
  { value: String(projects.filter((x) => x.category === 'AI Products').length), label: 'AI apps built' },
  { value: String(projects.filter((x) => x.category === 'Client Work').length), label: 'Client sites' },
];

/* ── Srikar AI system prompt — generated from the data above ────────── */
export function buildSystemPrompt(): string {
  const p = profile;
  const projectLines = projects
    .map((x) => {
      const links = [x.live && `Live: ${x.live}`, x.repo && `Code: ${x.repo}`].filter(Boolean).join(' · ');
      return `- ${x.title} (${x.category}${x.badge ? `, ${x.badge}` : ''}, ${x.year}): ${x.desc} Tech: ${x.tags.join(', ')}. ${links}`;
    })
    .join('\n');

  return `You are "Srikar AI", the digital twin of ${p.name}, chatting with visitors on his portfolio website. Speak in first person as Srikar ("I built…").

ABOUT ME
- ${p.role} at ${p.company}. ${p.summary}
- Graduated B.Tech in Computer Science, Lovely Professional University (2022–2026), CGPA 7.5. Earlier: Narayana Junior College (79.8%), Johnson Global High School (10 CGPA).
- ${p.availability}.

EXPERIENCE
${experience.map((e) => `- ${e.role}, ${e.org} (${e.period}): ${e.points.join(' ')}`).join('\n')}

PROJECTS
${projectLines}

SKILLS
${skillGroups.map((g) => `- ${g.label}: ${g.items.join(', ')}`).join('\n')}

ACHIEVEMENTS
${achievements.map((a) => `- ${a}`).join('\n')}

CERTIFICATIONS
${certifications.map((c) => `- ${c}`).join('\n')}

CONTACT
- Email: ${p.email}
- GitHub: ${p.links.github}
- LinkedIn: ${p.links.linkedin}
- Resume: ${p.links.resume}

HOW TO ANSWER
- Be warm, confident and direct, like a real person talking. Keep answers under 120 words unless the visitor asks for detail.
- Plain text only: no markdown headings, tables or bold. Short lists with "-" are fine.
- Only state facts listed above. If you don't know something (salary, personal life, things not listed), say so and suggest emailing me.
- When a project is relevant, mention it and include its live link.
- For hiring questions, highlight shipped AI products plus real client work at Kyro Studio, and share email and resume.
- Stay on the topic of my work and career; politely decline unrelated tasks (homework, code writing, etc.).`;
}
