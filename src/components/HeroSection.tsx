import React, { useRef, useEffect, useCallback } from 'react';
import './HeroSection.css';

export interface HeroSectionProps {
  isRevealed?: boolean;
  onNavigate?: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isRevealed = true,
  onNavigate,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isTiltingRef = useRef(false);
  const targetRef = useRef({ rx: 0, ry: 0, ty: 0, scale: 1 });

  const resetCardTransform = useCallback(() => {
    isTiltingRef.current = false;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove('is-tilting');
    card.style.setProperty('--tilt-rx', '0deg');
    card.style.setProperty('--tilt-ry', '0deg');
    card.style.setProperty('--tilt-ty', '0px');
    card.style.setProperty('--tilt-scale', '1');
  }, []);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const card = cardRef.current;
      if (!card) return;
      isTiltingRef.current = true;
      card.classList.add('is-tilting');
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      isTiltingRef.current = true;
      if (!card.classList.contains('is-tilting')) {
        card.classList.add('is-tilting');
      }

      // Normalized coordinates from -1 to 1 (-1 = left/top, 1 = right/bottom, 0 = center)
      const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));

      // Natural inclination toward cursor (card surface gently inclines toward cursor position):
      // - Pointer moves top (ny < 0) -> top edge inclines toward viewer/cursor (rx < 0 in CSS)
      // - Pointer moves right (nx > 0) -> right edge inclines toward viewer/cursor (ry < 0 in CSS)
      // Max rotation: 4.5 degrees on either axis
      // Lift: -5px (4-6px range)
      // Scale: 1.015 (1.01-1.02 range)
      const maxRot = 4.5;
      const rx = ny * maxRot;
      const ry = -nx * maxRot;

      targetRef.current = { rx, ry, ty: -5, scale: 1.015 };

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          if (!cardRef.current || !isTiltingRef.current) return;
          const { rx: rX, ry: rY, ty, scale } = targetRef.current;
          cardRef.current.style.setProperty('--tilt-rx', `${rX.toFixed(2)}deg`);
          cardRef.current.style.setProperty('--tilt-ry', `${rY.toFixed(2)}deg`);
          cardRef.current.style.setProperty('--tilt-ty', `${ty.toFixed(1)}px`);
          cardRef.current.style.setProperty('--tilt-scale', `${scale.toFixed(3)}`);
        });
      }
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    resetCardTransform();
  }, [resetCardTransform]);

  useEffect(() => {
    const handleWindowBlur = () => {
      resetCardTransform();
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      isTiltingRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [resetCardTransform]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const entranceClass = isRevealed ? 'hero-revealed' : 'hero-hidden';

  return (
    <section
      id="hero"
      className={`kosha-hero-section ${entranceClass}`}
      aria-label="KOSHA Welcome &amp; Introduction"
    >
      <div className="kosha-hero-inner">
        {/* Left Column: Editorial Brand & Headlines */}
        <div className="kosha-hero-text-col">
          {/* Eyebrow Label */}
          <div className="kosha-hero-eyebrow-wrapper">
            <span className="kosha-hero-eyebrow-pill">
              <span className="kosha-eyebrow-dot" aria-hidden="true" />
              <span>KOSHĀ · CAFÉ &amp; EXPERIENCE STUDIO</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="kosha-hero-headline">
            <span className="kosha-headline-line">Your Everyday</span>
            <span className="kosha-headline-line">
              <span className="kosha-headline-italic">Escape.</span>
            </span>
          </h1>

          {/* Tagline & Supporting Copy */}
          <div className="kosha-hero-copy-group">
            <p className="kosha-hero-tagline">EAT. GATHER. DISCOVER.</p>
            <p className="kosha-hero-description">
              A warm café and experience studio where thoughtfully made food,
              shared moments, creative gatherings and discovery come together.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="kosha-hero-actions">
            <a
              href="#menu"
              className="kosha-hero-btn-primary"
              onClick={(e) => handleAnchorClick(e, 'menu')}
            >
              <span>Explore the Menu</span>
              <span className="kosha-btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a
              href="#visit"
              className="kosha-hero-btn-secondary"
              onClick={(e) => handleAnchorClick(e, 'visit')}
            >
              <span>Find Us</span>
            </a>
          </div>

          {/* Subtle Informational Row */}
          <div className="kosha-hero-info-row" role="list">
            <div className="kosha-info-item" role="listitem">
              <span className="kosha-info-label">FOOD</span>
              <span className="kosha-info-value">Thoughtfully made</span>
            </div>
            <div className="kosha-info-item" role="listitem">
              <span className="kosha-info-label">SPACE</span>
              <span className="kosha-info-value">Made for gathering</span>
            </div>
            <div className="kosha-info-item" role="listitem">
              <span className="kosha-info-label">PHILOSOPHY</span>
              <span className="kosha-info-value">Five elements</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tactile Photographic Feature Card */}
        <div className="kosha-hero-media-col">
          <div
            ref={cardRef}
            className="kosha-media-card"
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerLeave}
          >
            {/* Soft Claymorphic Circular Badge */}
            <div
              className="kosha-clay-badge"
              aria-label="KOSHĀ: Eat. Gather. Discover."
            >
              <span className="kosha-badge-title">KOSHĀ</span>
              <span className="kosha-badge-tagline">
                Eat. Gather.
                <br />
                Discover.
              </span>
            </div>

            {/* Photographic Image Frame */}
            <div className="kosha-image-frame">
              <picture>
                <source srcSet="/images/kosha-hero.webp" type="image/webp" />
                <img
                  src="/images/kosha-hero.jpg"
                  alt="A warm, sunlit gathering table at KOSHĀ café with artisanal coffee, fresh pastry, and mindful conversations"
                  className="kosha-hero-image"
                  width="896"
                  height="1200"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
