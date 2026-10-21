import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/data/profile';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.summary} Projects include BillShield, CareerCopilot AI, InterviewMirror AI and client sites for Kyro Studio.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title,
  description,
  keywords: ['Srikar Merugu', 'AI Engineer', 'Full Stack Developer', 'Kyro Studio', 'Next.js', 'Claude API', 'Portfolio'],
  authors: [{ name: profile.name, url: profile.website }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: profile.website,
    title,
    description,
    siteName: profile.name,
    images: [{ url: '/projects/billshield.jpg', width: 1200, height: 750, alt: 'BillShield — a project by Srikar Merugu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/projects/billshield.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#060608',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
