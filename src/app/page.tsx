import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation/Navigation';
import VideoIntro from '@/components/VideoIntro/VideoIntro';
import WorksSection from '@/components/WorksSection/WorksSection';
import HolographicSkills from '@/components/HolographicSkills/HolographicSkills';
import AboutSection from '@/components/AboutSection/AboutSection';
import ContactSection from '@/components/ContactSection/ContactSection';

// The chat widget pulls in Three.js — load it only in the browser.
const SrikarAI = dynamic(() => import('@/components/SrikarAI/SrikarAI'), { ssr: false });

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <VideoIntro />
        <WorksSection />
        <HolographicSkills />
        <AboutSection />
        <ContactSection />
      </main>
      <SrikarAI />
    </>
  );
}
