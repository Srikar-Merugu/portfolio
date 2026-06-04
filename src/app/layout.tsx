import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Srikar Merugu — AI Engineer & Full Stack Developer',
  description: 'Portfolio of Srikar Merugu — AI Engineer and Full Stack Developer specializing in SaaS products, Generative AI, React, Node.js and cloud technologies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
