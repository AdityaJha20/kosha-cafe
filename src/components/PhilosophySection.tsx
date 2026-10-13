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
  accentColor: string;
  accentBg: string;
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
    accentColor: '#71836A', // warm grounded moss green
    accentBg: 'rgba(113, 131, 106, 0.12)',
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
    accentColor: '#537C86', // calm mineral teal / fresh water highlight
    accentBg: 'rgba(83, 124, 134, 0.12)',
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
    accentColor: '#C7684E', // restrained terracotta warmth
    accentBg: 'rgba(199, 104, 78, 0.12)',
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
    accentColor: '#7A8C78', // soft breathable sage neutral
    accentBg: 'rgba(122, 140, 120, 0.12)',
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
    accentColor: '#D6A33C', // gentle ochre warmth
    accentBg: 'rgba(214, 163, 60, 0.12)',
  },
];

// Easing function for liquid clay landing: cubic-bezier(0.22, 1, 0.36, 1)
function easeOutCubicBezier(t: number): number {
  return 1 - Math.pow(1 - t, 3.2);
}

// Compute organic liquid-clay Bézier contours (0 to 1 normalized bounding box)
function computeClayPath(dir: 'forward' | 'backward', progress: number): string {
  const p = Math.max(0, Math.min(1, progress));
  if (p >= 1) {
    return 'M 0 0 L 1 0 L 1 1 L 0 1 Z';
  }
  if (dir === 'forward') {
    // Forward: sweeps from right (x=1) to left (x=0)
    const xBase = 1 - p;
    const waveAmp = Math.sin(p * Math.PI) * 0.22;

    const xTop = Math.max(0, Math.min(1, xBase + waveAmp * 0.4));
    const xMid = Math.max(0, Math.min(1, xBase - waveAmp * 1.0)); // bulges forward to the left
    const xLow = Math.max(0, Math.min(1, xBase + waveAmp * 0.7)); // soft indent
    const xBot = Math.max(0, Math.min(1, xBase - waveAmp * 0.3));

    return `M 1 0 L ${xTop.toFixed(4)} 0 C ${(xTop - waveAmp * 0.5).toFixed(4)} 0.18, ${(xMid + waveAmp * 0.3).toFixed(4)} 0.32, ${xMid.toFixed(4)} 0.48 C ${(xMid - waveAmp * 0.3).toFixed(4)} 0.64, ${(xLow + waveAmp * 0.4).toFixed(4)} 0.76, ${xLow.toFixed(4)} 0.88 C ${(xLow - waveAmp * 0.2).toFixed(4)} 0.94, ${(xBot + 0.05).toFixed(4)} 0.98, ${xBot.toFixed(4)} 1 L 1 1 Z`;
  } else {
    // Backward: sweeps from left (x=0) to right (x=1)
    const xBase = p;
    const waveAmp = Math.sin(p * Math.PI) * 0.22;

    const xTop = Math.max(0, Math.min(1, xBase - waveAmp * 0.4));
    const xMid = Math.max(0, Math.min(1, xBase + waveAmp * 1.0)); // bulges forward to the right
    const xLow = Math.max(0, Math.min(1, xBase - waveAmp * 0.7));
    const xBot = Math.max(0, Math.min(1, xBase + waveAmp * 0.3));

    return `M 0 0 L ${xTop.toFixed(4)} 0 C ${(xTop + waveAmp * 0.5).toFixed(4)} 0.18, ${(xMid - waveAmp * 0.3).toFixed(4)} 0.32, ${xMid.toFixed(4)} 0.48 C ${(xMid + waveAmp * 0.3).toFixed(4)} 0.64, ${(xLow - waveAmp * 0.4).toFixed(4)} 0.76, ${xLow.toFixed(4)} 0.88 C ${(xLow + waveAmp * 0.2).toFixed(4)} 0.94, ${(xBot - 0.05).toFixed(4)} 0.98, ${xBot.toFixed(4)} 1 L 0 1 Z`;
  }
}

export interface PhilosophySectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  canAnimate = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [transitionId, setTransitionId] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isManualHold, setIsManualHold] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const clayPathRef = useRef<SVGPathElement | null>(null);
  const activeElement = PHILOSOPHY_ELEMENTS[activeIndex];
  const prevElement = prevIndex !== null ? PHILOSOPHY_ELEMENTS[prevIndex] : null;

  // Listen to prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Central element change dispatcher
  const changeElement = useCallback(
    (newIndex: number, forcedDirection?: 'forward' | 'backward') => {
      if (newIndex === activeIndex) return;
      const dir = forcedDirection ?? (newIndex > activeIndex ? 'forward' : 'backward');
      setPrevIndex(activeIndex);
      setActiveIndex(newIndex);
      setDirection(dir);
      setTransitionId((prev) => prev + 1);

      if (newIndex >= 3) {
        // Air (3) or Aether (4): hold autoplay so user can read comfortably
        setIsManualHold(true);
      } else {
        // Earth, Water, Fire: continue rotation from this point when active
        setIsManualHold(false);
      }
    },
    [activeIndex]
  );

  // Animate the liquid-clay morph path via requestAnimationFrame
  useEffect(() => {
    if (prevIndex === null || prefersReducedMotion) {
      if (clayPathRef.current) {
        clayPathRef.current.setAttribute('d', 'M 0 0 L 1 0 L 1 1 L 0 1 Z');
      }
      return;
    }

    // Immediately initialize to frame 0 to prevent unclipped flash
    if (clayPathRef.current) {
      clayPathRef.current.setAttribute('d', computeClayPath(direction, 0));
    }

    let rafId: number;
    const startTime = performance.now();
    const duration = 850;

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubicBezier(progress);
      const d = computeClayPath(direction, eased);

      if (clayPathRef.current) {
        clayPathRef.current.setAttribute('d', d);
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animateFrame);
      } else {
        setPrevIndex(null);
      }
    };

    rafId = requestAnimationFrame(animateFrame);
    return () => cancelAnimationFrame(rafId);
  }, [transitionId, direction, prefersReducedMotion]);

  // Manual selector click handler
  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      const dir = index > activeIndex ? 'forward' : 'backward';
      changeElement(index, dir);
    },
    [activeIndex, changeElement]
  );

  // Previous & Next navigation controls
  const handlePrevious = useCallback(() => {
    const nextIndex = (activeIndex - 1 + PHILOSOPHY_ELEMENTS.length) % PHILOSOPHY_ELEMENTS.length;
    changeElement(nextIndex, 'backward');
  }, [activeIndex, changeElement]);

  const handleNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % PHILOSOPHY_ELEMENTS.length;
    changeElement(nextIndex, 'forward');
  }, [activeIndex, changeElement]);

  // Autoplay eligibility: only rotates Earth (0) -> Water (1) -> Fire (2) -> Earth (0)
  const isAutoplayEligible =
    canAnimate &&
    !isPaused &&
    !isManualHold &&
    activeIndex < 3 &&
    !prefersReducedMotion;

  // Autoplay Effect: Exactly 3000ms loop
  useEffect(() => {
    if (!isAutoplayEligible) return;

    const timer = setTimeout(() => {
      const nextIndex = activeIndex === 2 ? 0 : activeIndex + 1;
      setPrevIndex(activeIndex);
      setActiveIndex(nextIndex);
      setDirection('forward');
      setTransitionId((prev) => prev + 1);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeIndex, isAutoplayEligible]);

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
      style={{ '--active-element-accent': activeElement.accentColor } as React.CSSProperties}
    >
      {/* Dynamic SVG Liquid-Clay Morph Clip Definition */}
      <svg
        width="0"
        height="0"
        className="kosha-philo-svg-defs"
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <clipPath id="koshaClayClip" clipPathUnits="objectBoundingBox">
            <path ref={clayPathRef} d="M 0 0 L 1 0 L 1 1 L 0 1 Z" />
          </clipPath>
        </defs>
      </svg>

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
            <div className="kosha-philo-story-stage">
              {/* Outgoing Story Layer (animates away on transition) */}
              {prevElement && (
                <div
                  key={`story-exit-${prevElement.id}-${transitionId}`}
                  className={`kosha-philo-story-layer is-exiting is-exiting-${direction}`}
                  aria-hidden="true"
                >
                  <div className="kosha-philo-meta">
                    <span
                      className="kosha-philo-index"
                      style={{ color: prevElement.accentColor }}
                    >
                      {prevElement.index}
                    </span>
                    <span
                      className="kosha-philo-dot"
                      style={{ backgroundColor: prevElement.accentColor }}
                      aria-hidden="true"
                    />
                    <span className="kosha-philo-label">{prevElement.label}</span>
                  </div>

                  <h3 className="kosha-philo-title">{prevElement.name}</h3>
                  <p className="kosha-philo-statement">{prevElement.statement}</p>
                  <p className="kosha-philo-body">{prevElement.description}</p>

                  <div className="kosha-philo-callout">
                    <span
                      className="kosha-philo-callout-title"
                      style={{ color: prevElement.accentColor }}
                    >
                      {prevElement.calloutTitle}
                    </span>
                    <p className="kosha-philo-callout-text">{prevElement.calloutText}</p>
                  </div>
                </div>
              )}

              {/* Incoming / Active Story Layer */}
              <div
                key={`story-enter-${activeElement.id}-${transitionId}`}
                className={`kosha-philo-story-layer is-active ${
                  prevElement ? `is-entering is-entering-${direction}` : 'is-settled'
                }`}
                style={{ '--element-accent': activeElement.accentColor } as React.CSSProperties}
              >
                {/* Index & Category Label */}
                <div className="kosha-philo-meta">
                  <span
                    className="kosha-philo-index"
                    style={{ color: activeElement.accentColor }}
                  >
                    {activeElement.index}
                  </span>
                  <span
                    className="kosha-philo-dot"
                    style={{ backgroundColor: activeElement.accentColor }}
                    aria-hidden="true"
                  />
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
                  <span
                    className="kosha-philo-callout-title"
                    style={{ color: activeElement.accentColor }}
                  >
                    {activeElement.calloutTitle}
                  </span>
                  <p className="kosha-philo-callout-text">{activeElement.calloutText}</p>
                </div>
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
                <span className="kosha-philo-nav-arrow kosha-philo-nav-arrow-left" aria-hidden="true">←</span>
                <span>PREV</span>
              </button>
              <div className="kosha-philo-nav-counter" aria-live="polite">
                <span
                  className="kosha-philo-counter-active"
                  style={{ color: activeElement.accentColor }}
                >
                  {activeElement.num}
                </span>
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
                <span className="kosha-philo-nav-arrow kosha-philo-nav-arrow-right" aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right Column (~60%): Cinematic Photograph Window with Liquid-Clay Morph */}
          <div className="kosha-philosophy-visual-col">
            <div className="kosha-philo-media-frame">
              {PHILOSOPHY_ELEMENTS.map((elem, idx) => {
                const isActive = idx === activeIndex;
                const isPrevious = idx === prevIndex;
                const isSettled = isActive && prevIndex === null;

                let layerClass = 'kosha-philo-image-layer';
                let style: React.CSSProperties | undefined = undefined;

                if (isSettled) {
                  layerClass += ' is-active is-settled';
                } else if (isActive) {
                  layerClass += ` is-active is-entering is-entering-${direction}`;
                  // Dynamic reference to active liquid-clay clip path
                  style = {
                    clipPath: 'url(#koshaClayClip)',
                    WebkitClipPath: 'url(#koshaClayClip)',
                  };
                } else if (isPrevious) {
                  layerClass += ` is-previous is-exiting is-exiting-${direction}`;
                } else {
                  layerClass += ' is-dormant';
                }

                return (
                  <div
                    key={`${elem.id}-${isActive ? `active-${transitionId}` : isPrevious ? `prev-${transitionId}` : 'idle'}`}
                    className={layerClass}
                    style={style}
                    aria-hidden={!isActive}
                  >
                    <img
                      src={elem.imageSrc}
                      alt={elem.imageAlt}
                      className="kosha-philo-image"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                );
              })}

              {/* Restrained Image Caption Overlay */}
              <div className="kosha-philo-caption-scrim">
                <span
                  className="kosha-philo-caption-pill"
                  key={`caption-${activeElement.id}-${transitionId}`}
                >
                  <span
                    className="kosha-philo-caption-dot"
                    style={{ backgroundColor: activeElement.accentColor }}
                    aria-hidden="true"
                  />
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
                className={`kosha-philo-selector-item ${isActive ? 'is-active' : ''} kosha-elem-${elem.id}`}
                onClick={() => handleSelect(idx)}
                style={
                  isActive
                    ? ({
                        '--element-accent': elem.accentColor,
                        '--element-accent-bg': elem.accentBg,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <div className="kosha-philo-selector-header">
                  <span
                    className="kosha-philo-selector-num"
                    style={isActive ? { color: elem.accentColor } : undefined}
                  >
                    {elem.num}
                  </span>
                  <span className="kosha-philo-selector-name">{elem.name}</span>
                </div>
                <span className="kosha-philo-selector-category">{elem.category}</span>

                {/* Progress Track & Underline Indicator */}
                <div className="kosha-philo-selector-track" aria-hidden="true">
                  {isActive && isAutoplayEligible && (
                    <div
                      key={`progress-${activeIndex}-${isPaused}-${transitionId}`}
                      className="kosha-philo-selector-progress"
                      style={{ backgroundColor: elem.accentColor }}
                    />
                  )}
                  {isActive && !isAutoplayEligible && (
                    <div
                      className="kosha-philo-selector-progress-static"
                      style={{ backgroundColor: elem.accentColor }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default PhilosophySection;

