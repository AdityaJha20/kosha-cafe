import React, { useRef, useState, useEffect } from 'react';
import './FoodBeverageSection.css';

export interface FoodBeverageSectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
}

export const FoodBeverageSection: React.FC<FoodBeverageSectionProps> = ({
  canAnimate = true,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (!canAnimate) return;

    // Safety fallback: if IntersectionObserver is not supported, reveal immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentElem = sectionRef.current;
    if (!currentElem) {
      setIsVisible(true);
      return;
    }

    // Immediate viewport evaluation if already visible
    const rect = currentElem.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
      setIsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry && entry.isIntersecting) {
            setIsVisible(true);
            if (observer && entry.target) {
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(currentElem);
    } catch {
      // Fail-open if observer fails to instantiate
      setIsVisible(true);
    }

    // Safety timer to prevent content from remaining hidden if observer is delayed or blocked
    const safetyTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => {
      window.clearTimeout(safetyTimer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [canAnimate]);

  const shouldAnimate = canAnimate && isVisible;

  return (
    <section
      id="menu"
      ref={sectionRef}
      className={`kosha-fb-section ${shouldAnimate ? 'is-revealed' : ''}`}
      aria-labelledby="fb-headline"
    >
      <div className="kosha-fb-inner">
        {/* Editorial Section Metadata Header */}
        <header className="kosha-fb-header">
          <div className="kosha-fb-index-row">
            <span className="kosha-fb-index-left">03 / FOOD &amp; BEVERAGE</span>
            <span className="kosha-fb-index-right">THOUGHTFULLY SOURCED · BEAUTIFULLY MADE</span>
          </div>

          <div className="kosha-fb-divider" aria-hidden="true" />

          {/* Main Editorial Headline & Adjacent Paragraph */}
          <div className="kosha-fb-intro-row">
            <div className="kosha-fb-headline-wrap">
              <span className="kosha-fb-eyebrow">EAT. GATHER. DISCOVER.</span>
              <h2 id="fb-headline" className="kosha-fb-headline">
                <span className="kosha-fb-line">A Taste of </span>
                <span className="kosha-fb-line kosha-fb-italic">KOSHĀ.</span>
              </h2>
            </div>
            <div className="kosha-fb-desc-wrap">
              <p className="kosha-fb-lead">
                Seasonal ingredients, thoughtful craft, and little moments worth slowing down for.
              </p>
            </div>
          </div>
        </header>

        {/* Main Two-Column Feature Composition */}
        <div className="kosha-fb-main-grid">
          {/* Left Column (~64%): Dominant Culinary Photograph */}
          <div className="kosha-fb-visual-col">
            <div className="kosha-fb-media-frame">
              <img
                src="/images/food-beverage-main.jpg"
                alt="Handcrafted artisanal tagliatelle pasta tossed in olive oil, fresh herbs, and parmesan in an earthy ceramic bowl with fresh garden basil"
                className="kosha-fb-main-image"
                loading="lazy"
                decoding="async"
              />
              {/* Restrained Image Caption Overlay */}
              <div className="kosha-fb-caption-scrim">
                <span className="kosha-fb-caption-pill">
                  <span className="kosha-fb-caption-dot" aria-hidden="true" />
                  <span>Handcrafted pasta &amp; seasonal herb craft</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (~36%): Editorial Storytelling Panel */}
          <div className="kosha-fb-story-col">
            <div className="kosha-fb-card">
              <div className="kosha-fb-card-top">
                <div className="kosha-fb-card-meta">
                  <span className="kosha-fb-card-category">FROM THE KITCHEN</span>
                  <span className="kosha-fb-card-id">01 · ORIGIN</span>
                </div>

                <h3 className="kosha-fb-card-title">
                  Good things<br />take care.
                </h3>

                <p className="kosha-fb-card-body">
                  Rooted in ingredients, shaped by craft, and served with an appreciation for the little
                  details. Every fixture and plate honours the time it takes to nurture something wholesome.
                </p>
              </div>

              <div className="kosha-fb-card-divider" aria-hidden="true" />

              {/* Secondary Culinary Photograph: Handcrafted Preparation */}
              <div className="kosha-fb-craft-frame">
                <img
                  src="/images/food-beverage-craft.jpg"
                  alt="Freshly pulled espresso macchiato with silky crema and roasted single-origin coffee beans on a teak wood tray"
                  className="kosha-fb-craft-image"
                  loading="lazy"
                  decoding="async"
                />
                <div className="kosha-fb-craft-scrim">
                  <span className="kosha-fb-craft-pill">
                    <span className="kosha-fb-craft-dot" aria-hidden="true" />
                    <span>Hearth roast &amp; morning espresso craft</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodBeverageSection;
