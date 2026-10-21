import Navigation from '@/components/Navigation/Navigation';
import VideoIntro from '@/components/VideoIntro/VideoIntro';
import WorksSection from '@/components/WorksSection/WorksSection';
import HolographicSkills from '@/components/HolographicSkills/HolographicSkills';
import AboutSection from '@/components/AboutSection/AboutSection';
import ContactSection from '@/components/ContactSection/ContactSection';
import IntroGate from '@/components/IntroGate/IntroGate';
import SrikarAI from '@/components/SrikarAI/SrikarAILazy';

export default function Home() {
  return (
    <>
      <IntroGate />
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
