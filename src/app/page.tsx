'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const LoadingScreen     = dynamic(() => import('@/components/LoadingScreen/LoadingScreen'),       { ssr: false });
const Navigation        = dynamic(() => import('@/components/Navigation/Navigation'),             { ssr: false });
const VideoIntro        = dynamic(() => import('@/components/VideoIntro/VideoIntro'),             { ssr: false });
const WorksSection      = dynamic(() => import('@/components/WorksSection/WorksSection'),         { ssr: false });
const HolographicSkills = dynamic(() => import('@/components/HolographicSkills/HolographicSkills'), { ssr: false });
const AboutSection      = dynamic(() => import('@/components/AboutSection/AboutSection'),         { ssr: false });
const ContactSection    = dynamic(() => import('@/components/ContactSection/ContactSection'),     { ssr: false });
const SrikarAI          = dynamic(() => import('@/components/SrikarAI/SrikarAI'),                 { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />

      <main style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
        pointerEvents: loaded ? 'all' : 'none',
      }}>
        <Navigation />
        <VideoIntro />
        <WorksSection />
        <HolographicSkills />
        <AboutSection />
        <ContactSection />
        <SrikarAI />
      </main>
    </>
  );
}
