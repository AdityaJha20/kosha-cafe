import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import CinematicIntro from './components/CinematicIntro';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PhilosophySection from './components/PhilosophySection';
import FoodBeverageSection from './components/FoodBeverageSection';

const shouldInitWithIntro = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  // Manual overrides for testing or accessibility
  if (params.get('intro') === '0' || params.get('skipIntro') === '1') return false;
  if (params.get('intro') === '1') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Always replay intro on every homepage reload/refresh
  return true;
};

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [introState, setIntroState] = useState<'playing' | 'revealing' | 'ready'>(() =>
    shouldInitWithIntro() ? 'playing' : 'ready'
  );
  const [isLogoDormant, setIsLogoDormant] = useState<boolean>(() =>
    shouldInitWithIntro()
  );

  const navbarLogoRef = useRef<HTMLImageElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Scroll spy to update active navigation pill
  useEffect(() => {
    const sectionIds = ['about', 'menu', 'experiences', 'space', 'visit'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 200; // Trigger threshold below header

      // If at very top, default to 'about' as per reference
      if (scrollY < 100) {
        setActiveSection('about');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const elem = document.getElementById(id);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleIntroStart = useCallback(() => {
    setIntroState('playing');
    setIsLogoDormant(true);
  }, []);

  const handleLogoTransitStart = useCallback(() => {
    setIntroState('revealing');
    setIsLogoDormant(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroState('ready');
    setIsLogoDormant(false);
  }, []);

  return (
    <div className="kosha-app-root">
      {/* Cinematic Logo Intro Overlay */}
      <CinematicIntro
        navbarLogoRef={navbarLogoRef}
        onIntroStart={handleIntroStart}
        onLogoTransitStart={handleLogoTransitStart}
        onComplete={handleIntroComplete}
      />

      {/* Floating Island Capsule Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        logoRef={navbarLogoRef}
        headerRef={headerRef}
        introState={introState}
        isLogoDormant={isLogoDormant}
      />

      {/* Hero Canvas with Warm Editorial Luxury Section */}
      <main id="top" className="kosha-main-canvas" aria-label="KOSHA Experience Studio">
        <HeroSection
          isRevealed={introState === 'ready'}
          onNavigate={handleNavigate}
        />
        <AboutSection
          canAnimate={introState === 'ready'}
          onNavigate={handleNavigate}
        />
        <PhilosophySection
          canAnimate={introState === 'ready'}
          onNavigate={handleNavigate}
        />
        <FoodBeverageSection
          canAnimate={introState === 'ready'}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
};

export default App;
