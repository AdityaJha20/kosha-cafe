import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PhilosophySection.css';

export interface PhilosophyElement {
  id: string;
  index: string; // e.g. "01 / 05"
  num: string; // e.g. "01"
  name: string; // "EARTH"
  category: string; // "ORIGIN"
  label: string; // "EARTH — ORIGIN"
  statement: string;
  description: string;
  calloutTitle: string;
  calloutText: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
}

export const PHILOSOPHY_ELEMENTS: PhilosophyElement[] = [
  {
    id: 'earth',
    index: '01 / 05',
    num: '01',
    name: 'EARTH',
    category: 'ORIGIN',
    label: 'EARTH — ORIGIN',
    statement: 'Grounded in where we begin.',
    description:
      'Every thoughtful experience starts with its origins. Earth represents seasonal ingredients, honest materials, local roots, and the simple beauty of things made with care.',
    calloutTitle: 'THE ROOTS OF KOSHĀ',
    calloutText: 'Thoughtful ingredients, natural materials, and a connection to the land.',
    imageSrc: '/images/earth-origin.jpg',
    imageAlt: 'Artisanal seasonal vegetables, herbs and wild mushrooms on raw stone slab',
    caption: 'Seasonal produce, wild herbs & travertine stone craft',
  },
  {
    id: 'water',
    index: '02 / 05',
    num: '02',
    name: 'WATER',
    category: 'VITALITY',
    label: 'WATER — VITALITY',
    statement: 'A quieter kind of freshness.',
    description:
      'Water brings clarity, movement, and renewal. It inspires the refreshing details, balanced flavours, and little moments of calm that make an experience feel effortless.',
    calloutTitle: 'A SENSE OF RENEWAL',
    calloutText: 'Balanced flavours, refreshing details, and moments of clarity.',
    imageSrc: '/images/water-vitality.jpg',
    imageAlt: 'Crystal glass of botanical cold-infused water with cucumber and mint on stone counter',
    caption: 'Botanical infusions, clarity & restorative calm',
  },
  {
    id: 'fire',
    index: '03 / 05',
    num: '03',
    name: 'FIRE',
    category: 'TRANSFORMATION',
    label: 'FIRE — TRANSFORMATION',
    statement: 'Where simple ingredients become something more.',
    description:
      'Fire represents the craft of preparation, the warmth of cooking, and the transformation of ingredients through time, technique, and attention.',
    calloutTitle: 'THE ART OF TRANSFORMATION',
    calloutText: 'Careful preparation, culinary craft, and the warmth of cooking.',
    imageSrc: '/images/fire-transformation.jpg',
    imageAlt: 'Wood-fired brick hearth oven with glowing embers and artisanal baked tart',
    caption: 'Wood-fired hearth craft, roasted grains & copper warmth',
  },
  {
    id: 'air',
    index: '04 / 05',
    num: '04',
    name: 'AIR',
    category: 'BALANCE',
    label: 'AIR — BALANCE',
    statement: 'Space to slow down and feel present.',
    description:
      'Air is the pause between moments. It inspires open space, thoughtful design, gentle rhythms, and an atmosphere where people can breathe, settle in, and simply be.',
    calloutTitle: 'ROOM TO BREATHE',
    calloutText: 'Open space, considered design, and an atmosphere of calm.',
    imageSrc: '/images/air-balance.jpg',
    imageAlt: 'Serene sunlit café sanctuary with gentle morning breeze through natural linen curtains',
    caption: 'Sunlit linen, architectural stillness & open breathing room',
  },
  {
    id: 'aether',
    index: '05 / 05',
    num: '05',
    name: 'AETHER',
    category: 'CONNECTION',
    label: 'AETHER — CONNECTION',
    statement: 'The moments that bring us together.',
    description:
      'Aether is the feeling that stays with us. It lives in shared tables, meaningful conversations, creative gatherings, and the connection between people, place, food, and experience.',
    calloutTitle: 'A PLACE TO CONNECT',
    calloutText: 'Shared tables, meaningful conversations, and experiences worth remembering.',
    imageSrc: '/images/aether-connection.jpg',
    imageAlt: 'Communal wooden dining table at KOSHA with friends sharing ceramic plates and filter coffee',
    caption: 'Communal tables, shared conversation & lasting memory',
  },
];

export interface PhilosophySectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  canAnimate = true,
  onNavigate: _onNavigate,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isManualHold, setIsManualHold] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const activeElement = PHILOSOPHY_ELEMENTS[activeIndex];

  // Manual selector click handler
  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    if (index >= 3) {
      // Air (3) or Aether (4): hold autoplay so user can read comfortably
      setIsManualHold(true);
    } else {
      // Earth, Water, Fire: continue rotation from this point when active
      setIsManualHold(false);
    }
  }, []);

  // Previous & Next navigation controls
  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIndex = (prev - 1 + PHILOSOPHY_ELEMENTS.length) % PHILOSOPHY_ELEMENTS.length;
      if (nextIndex >= 3) {
        setIsManualHold(true);
      } else {
        setIsManualHold(false);
      }
      return nextIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIndex = (prev + 1) % PHILOSOPHY_ELEMENTS.length;
      if (nextIndex >= 3) {
        setIsManualHold(true);
      } else {
        setIsManualHold(false);
      }
      return nextIndex;
    });
  }, []);

  // Autoplay Effect: Earth (0) -> Water (1) -> Fire (2) -> Earth (0) every 3000ms
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion: disable autoplay
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // Do not run autoplay before intro completes
    if (!canAnimate) return;

    // Do not run if user is currently interacting (hover/focus) or in manual reading hold (Air/Aether)
    if (isPaused || isManualHold) return;

    // Clean 3000ms timer for Earth -> Water -> Fire loop
    const timer = setTimeout(() => {
      setActiveIndex((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return 2;
        return 0;
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeIndex, isPaused, isManualHold, canAnimate]);

  // Interaction handlers to pause during hovering/focusing
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = (e: React.FocusEvent) => {
    // Only resume if focus left the section completely
    if (!sectionRef.current?.contains(e.relatedTarget as Node)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="kosha-philosophy-section"
      aria-labelledby="philosophy-headline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="kosha-philosophy-inner">
        {/* Section Introductory Header */}
        <header className="kosha-philosophy-header">
          {/* Metadata Index Row */}
          <div className="kosha-philosophy-index-row">
            <span className="kosha-philosophy-index-left">02 / PHILOSOPHY</span>
            <span className="kosha-philosophy-index-right">A WAY OF SEEING, TASTING &amp; GATHERING</span>
          </div>

          <div className="kosha-philosophy-divider" aria-hidden="true" />

          {/* Headline and Supporting Intro Paragraph Side by Side */}
          <div className="kosha-philosophy-intro-row">
            <div className="kosha-philosophy-headline-wrap">
              <h2 id="philosophy-headline" className="kosha-philosophy-headline">
                <span className="kosha-philo-line">Five elements.</span>
                <span className="kosha-philo-line kosha-philo-italic">One experience.</span>
              </h2>
            </div>
            <div className="kosha-philosophy-desc-wrap">
              <p className="kosha-philosophy-lead">
                Rooted in the natural world, shaped by thoughtful craft, and brought to life around the
                table — discover the elements that inspire KOSHĀ.
              </p>
            </div>
          </div>
        </header>

        {/* Main Interactive Two-Column Experience */}
        <div className="kosha-philosophy-main-grid">
          {/* Left Column (~40%): Active Story, Details & Navigation */}
          <div className="kosha-philosophy-story-col">
            <div className="kosha-philo-story-content" key={activeElement.id}>
              {/* Index & Category Label */}
              <div className="kosha-philo-meta">
                <span className="kosha-philo-index">{activeElement.index}</span>
                <span className="kosha-philo-dot" aria-hidden="true" />
                <span className="kosha-philo-label">{activeElement.label}</span>
              </div>

              {/* Large Element Name Display */}
              <h3 className="kosha-philo-title">{activeElement.name}</h3>

              {/* Elegant Statement */}
              <p className="kosha-philo-statement">{activeElement.statement}</p>

              {/* Concise Description */}
              <p className="kosha-philo-body">{activeElement.description}</p>

              {/* Supporting Detail Panel / Callout */}
              <div className="kosha-philo-callout">
                <span className="kosha-philo-callout-title">{activeElement.calloutTitle}</span>
                <p className="kosha-philo-callout-text">{activeElement.calloutText}</p>
              </div>
            </div>

            {/* Previous & Next Traversal Controls */}
            <div className="kosha-philo-nav-row" aria-label="Element navigation controls">
              <button
                type="button"
                className="kosha-philo-nav-btn"
                onClick={handlePrevious}
                aria-label="Previous element"
              >
                <span aria-hidden="true">←</span>
                <span>PREV</span>
              </button>
              <div className="kosha-philo-nav-counter" aria-live="polite">
                <span>{activeElement.num}</span>
                <span className="kosha-philo-nav-sep">/</span>
                <span>05</span>
              </div>
              <button
                type="button"
                className="kosha-philo-nav-btn"
                onClick={handleNext}
                aria-label="Next element"
              >
                <span>NEXT</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right Column (~60%): Cinematic Photograph Window with Layered Crossfade */}
          <div className="kosha-philosophy-visual-col">
            <div className="kosha-philo-media-frame">
              {PHILOSOPHY_ELEMENTS.map((elem, idx) => (
                <div
                  key={elem.id}
                  className={`kosha-philo-image-layer ${idx === activeIndex ? 'is-active' : ''}`}
                  aria-hidden={idx !== activeIndex}
                >
                  <img
                    src={elem.imageSrc}
                    alt={elem.imageAlt}
                    className="kosha-philo-image"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              ))}

              {/* Restrained Image Caption Overlay */}
              <div className="kosha-philo-caption-scrim">
                <span className="kosha-philo-caption-pill" key={activeElement.id}>
                  <span className="kosha-philo-caption-dot" aria-hidden="true" />
                  <span>{activeElement.caption}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Five-Element Horizontal Selector Beneath the Composition */}
        <nav
          className="kosha-philosophy-selector-row"
          aria-label="Select Philosophy Element"
          role="tablist"
        >
          {PHILOSOPHY_ELEMENTS.map((elem, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={elem.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                className={`kosha-philo-selector-item ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <div className="kosha-philo-selector-header">
                  <span className="kosha-philo-selector-num">{elem.num}</span>
                  <span className="kosha-philo-selector-name">{elem.name}</span>
                </div>
                <span className="kosha-philo-selector-category">{elem.category}</span>
                <div className="kosha-philo-selector-indicator" aria-hidden="true" />
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default PhilosophySection;
