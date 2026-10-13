import React, { useEffect, useRef, useState, useCallback } from 'react';
import './AboutSection.css';

export interface AboutSectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  canAnimate = true,
  onNavigate,
}) => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  const [isIntroRevealed, setIsIntroRevealed] = useState<boolean>(false);
  const [isImageRevealed, setIsImageRevealed] = useState<boolean>(false);
  const [isInfoRevealed, setIsInfoRevealed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Honor reduced-motion preference: reveal immediately without animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIntroRevealed(true);
      setIsImageRevealed(true);
      setIsInfoRevealed(true);
      return;
    }

    // Do not trigger or arm observers until the logo intro has finished
    if (!canAnimate) {
      return;
    }

    // Fallback if IntersectionObserver is unavailable
    if (!('IntersectionObserver' in window)) {
      setIsIntroRevealed(true);
      setIsImageRevealed(true);
      setIsInfoRevealed(true);
      return;
    }

    const observers: IntersectionObserver[] = [];

    const setupObserver = (
      element: HTMLElement | null,
      isAlreadyRevealed: boolean,
      onReveal: () => void,
      options: IntersectionObserverInit
    ) => {
      if (!element || isAlreadyRevealed) return;

      // Immediate viewport evaluation: if content is already visible when intro completes, trigger immediately
      const rect = element.getBoundingClientRect();
      const triggerThreshold = window.innerHeight * 0.88;
      if (rect.top <= triggerThreshold && rect.bottom >= 0) {
        onReveal();
        return;
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          onReveal();
          observer.unobserve(entry.target);
        }
      }, options);

      observer.observe(element);
      observers.push(observer);
    };

    // Group 1: Editorial introduction (Index, Eyebrow, Headline)
    setupObserver(
      introRef.current,
      isIntroRevealed,
      () => setIsIntroRevealed(true),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Group 2: Panoramic Photograph
    setupObserver(
      mediaRef.current,
      isImageRevealed,
      () => setIsImageRevealed(true),
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    // Group 3: Supporting Editorial Information
    setupObserver(
      infoRef.current,
      isInfoRevealed,
      () => setIsInfoRevealed(true),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, [canAnimate, isIntroRevealed, isImageRevealed, isInfoRevealed]);

  const handlePhilosophyClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate('philosophy');
      } else {
        const target = document.getElementById('philosophy');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [onNavigate]
  );

  return (
    <section
      id="about"
      className="kosha-about-section"
      aria-labelledby="about-headline"
    >
      <div className="kosha-about-inner">
        {/* Group 1: Editorial Introduction */}
        <div
          ref={introRef}
          className={`kosha-about-intro-group ${
            isIntroRevealed ? 'intro-revealed' : 'intro-dormant'
          }`}
        >
          {/* Editorial Index Header */}
          <div className="kosha-about-index-row">
            <span className="kosha-about-index-item kosha-about-index-left">
              02 / ABOUT KOSHĀ
            </span>
            <span className="kosha-about-index-item kosha-about-index-right">
              FOOD · PEOPLE · DISCOVERY
            </span>
          </div>

          <div className="kosha-about-divider" aria-hidden="true" />

          {/* Eyebrow & Display Headline */}
          <div className="kosha-about-header-group">
            <p className="kosha-about-eyebrow">SANCTUARY OF INTENTIONAL TASTE</p>
            <div className="kosha-about-headline-mask">
              <h2 id="about-headline" className="kosha-about-headline">
                <span className="kosha-about-headline-text">
                  <span>More than a </span>
                  <span className="kosha-about-headline-accent">café.</span>
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Group 2: Panoramic Photograph Window */}
        <div ref={mediaRef} className="kosha-about-media-wrapper">
          <div
            className={`kosha-about-media-frame ${
              isImageRevealed ? 'image-revealed' : 'image-dormant'
            }`}
          >
            <div className="kosha-about-media-reveal">
              <picture>
                <source srcSet="/images/kosha-hero.webp" type="image/webp" />
                <img
                  src="/images/kosha-hero.jpg"
                  alt="A warm, sunlit gathering table at KOSHĀ café with artisanal coffee, fresh pastry, and mindful conversations"
                  className="kosha-about-panoramic-image"
                  width="1200"
                  height="510"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Group 3: Two-Column Editorial Information Layer */}
        <div
          ref={infoRef}
          className={`kosha-about-info-layer ${
            isInfoRevealed ? 'info-revealed' : 'info-dormant'
          }`}
        >
          {/* Left Column: Brand Description */}
          <div className="kosha-about-description-col">
            <p className="kosha-about-description-text">
              KOSHĀ takes its name from the Sanskrit word for layer or essence.
              Built around the five elements, KOSHĀ brings together food, craft,
              design and thoughtful experiences in one space. A place to eat,
              meet, pause, work, discover and experience something new.
            </p>
          </div>

          {/* Right Column: Editorial Brand Signature & Philosophy Link */}
          <div className="kosha-about-signature-col">
            <p className="kosha-about-signature-tagline">
              TASTE. TEXTURE. THOUGHT.
            </p>
            <div className="kosha-about-link-container">
              <a
                href="#philosophy"
                className="kosha-about-philosophy-link"
                onClick={handlePhilosophyClick}
                aria-label="Discover the KOSHĀ philosophy"
              >
                <span>Discover the KOSHĀ philosophy</span>
                <span className="kosha-about-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
