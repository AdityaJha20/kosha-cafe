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
  const sectionRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoColRef = useRef<HTMLDivElement | null>(null);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasUserToggledSound, setHasUserToggledSound] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Honor reduced-motion preference: reveal immediately without animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    // Do not trigger or arm observers until the logo intro has finished
    if (!canAnimate) {
      return;
    }

    // Fallback if IntersectionObserver is unavailable
    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    // Immediate viewport evaluation: if content is already visible, trigger immediately
    const rect = section.getBoundingClientRect();
    const triggerThreshold = window.innerHeight * 0.88;
    if (rect.top <= triggerThreshold && rect.bottom >= 0) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [canAnimate]);

  // Video Autoplay and Viewport Synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Keep muted state in sync with video element
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener('volumechange', handleVolumeChange);

    // If user prefers reduced motion, do not autoplay
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return () => {
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }

    // Do not autoplay while logo intro overlay is active
    if (!canAnimate) {
      video.pause();
      return () => {
        video.removeEventListener('volumechange', handleVolumeChange);
      };
    }

    // Viewport-based playback: pause when offscreen, attempt muted autoplay when visible
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Attempt muted inline autoplay if video is paused
          if (video.paused) {
            if (!hasUserToggledSound) {
              video.muted = true;
            }
            video.play().catch(() => {
              // Autoplay policy prevented playback; poster and controls remain accessible
            });
          }
        } else {
          // Pause when outside viewport to conserve resources
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.2 }
    );

    videoObserver.observe(video);

    return () => {
      video.removeEventListener('volumechange', handleVolumeChange);
      videoObserver.disconnect();
    };
  }, [canAnimate, hasUserToggledSound]);

  const handleToggleSound = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    setHasUserToggledSound(true);
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    // If video was paused, start playback on sound toggle interaction
    if (video.paused) {
      video.play().catch(() => {});
    }
  }, []);

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
      ref={sectionRef}
      className={`kosha-about-section ${
        isRevealed ? 'about-revealed' : 'about-dormant'
      }`}
      aria-labelledby="about-headline"
    >
      <div className="kosha-about-inner">
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

        {/* Editorial Composition: Storytelling + Portrait Film */}
        <div className="kosha-about-editorial-grid">
          {/* Left Column: Storytelling Content */}
          <div ref={storyRef} className="kosha-about-story-col">
            {/* Header: Eyebrow & Display Headline */}
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

            {/* Narrative Body: Description, Tagline & Philosophy Link */}
            <div className="kosha-about-story-body">
              <p className="kosha-about-description-text">
                KOSHĀ takes its name from the Sanskrit word for layer or essence.
                Built around the five elements, KOSHĀ brings together food, craft,
                design and thoughtful experiences in one space. A place to eat,
                meet, pause, work, discover and experience something new.
              </p>

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

          {/* Right Column: Portrait Video Feature */}
          <div ref={videoColRef} className="kosha-about-video-col">
            <div className="kosha-about-video-frame">
              <video
                ref={videoRef}
                className="kosha-about-portrait-video"
                src="/videos/about-kosha-film.mp4"
                poster="/images/about-kosha-film-poster.jpg"
                width="576"
                height="1024"
                playsInline
                muted
                loop
                controls
                preload="metadata"
                aria-label="KOSHĀ food and beverage experience film"
              />

              {/* Accessible Sound Toggle Pill */}
              <button
                type="button"
                className="kosha-about-sound-toggle"
                onClick={handleToggleSound}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                title={isMuted ? 'Unmute video sound' : 'Mute video sound'}
              >
                {isMuted ? (
                  <>
                    <svg
                      className="kosha-about-sound-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    <span className="kosha-about-sound-label">Unmute</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="kosha-about-sound-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span className="kosha-about-sound-label">Sound On</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
