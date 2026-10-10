import React from 'react';
import './HeroSection.css';

export interface HeroSectionProps {
  isRevealed?: boolean;
  onNavigate?: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isRevealed = true,
  onNavigate,
}) => {
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
          <div className="kosha-media-card">
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
