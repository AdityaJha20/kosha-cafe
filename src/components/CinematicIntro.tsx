import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CinematicIntro.css';

// Timing constants for intro playback and transition
export const TIME_REDUCTION_SEC = 1.0; // Desired reduction of exactly 1,000 ms
export const NEAR_END_OFFSET_SEC = 0.2; // Buffer before media ends to trigger transition

/**
 * Calculates the exact video playback rate needed to complete the effective
 * video playback portion 1,000 ms (1.0s) sooner.
 *
 * Effective media interval = video.duration - NEAR_END_OFFSET_SEC (4.0 - 0.2 = 3.8s)
 * Target real-time playback interval = effectiveMediaInterval - TIME_REDUCTION_SEC (3.8 - 1.0 = 2.8s)
 * PlaybackRate = 3.8 / 2.8 ≈ 1.35714
 */
export const calculatePlaybackRate = (duration: number): number => {
  const effectiveMediaInterval = (duration > 0 ? duration : 4.0) - NEAR_END_OFFSET_SEC;
  if (effectiveMediaInterval <= TIME_REDUCTION_SEC) {
    return 1.0;
  }
  const targetRealInterval = effectiveMediaInterval - TIME_REDUCTION_SEC;
  return effectiveMediaInterval / targetRealInterval;
};

/**
 * Accurately measures the final, settled viewport bounding rect of the target navbar logo,
 * neutralizing any transient CSS transform on the navbar wrapper or its ancestors.
 *
 * This ensures the traveling logo interpolates toward the exact resting coordinates rather than
 * an intermediate position measured mid-transition.
 */
export const getSettledTargetRect = (
  targetLogo: HTMLElement
): { left: number; top: number; width: number; height: number } => {
  const headerWrapper = targetLogo.closest<HTMLElement>('.kosha-header-wrapper');

  if (!headerWrapper) {
    const r = targetLogo.getBoundingClientRect();
    const fallbackH = window.innerWidth <= 900 ? 30 : 36;
    const h = r.height > 0 ? r.height : fallbackH;
    const w = r.width > 0 ? r.width : h * (2167 / 726);
    return {
      left: r.left,
      top: r.top,
      width: w,
      height: h,
    };
  }

  // Temporarily neutralize wrapper transform synchronously to measure resting layout
  const prevTransform = headerWrapper.style.transform;
  const prevTransition = headerWrapper.style.transition;

  headerWrapper.style.transition = 'none';
  headerWrapper.style.transform = 'none';

  const settledRect = targetLogo.getBoundingClientRect();

  // Restore previous style properties immediately within the same synchronous frame
  headerWrapper.style.transform = prevTransform;
  headerWrapper.style.transition = prevTransition;

  const fallbackHeight = window.innerWidth <= 900 ? 30 : 36;
  const finalH = settledRect.height > 0 ? settledRect.height : fallbackHeight;
  const finalW = settledRect.width > 0 ? settledRect.width : finalH * (2167 / 726);

  return {
    left: settledRect.left,
    top: settledRect.top,
    width: finalW,
    height: finalH,
  };
};

export interface CinematicIntroProps {
  navbarLogoRef: React.RefObject<HTMLImageElement | null>;
  onIntroStart?: () => void;
  onLogoTransitStart?: () => void;
  onComplete: () => void;
  videoSrc?: string;
  logoSrc?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  navbarLogoRef,
  onIntroStart,
  onLogoTransitStart,
  onComplete,
  videoSrc = '/videos/kosha-logo-intro.mp4',
  logoSrc = '/kosha-logo.png',
}) => {
  const [phase, setPhase] = useState<
    'init' | 'playing' | 'hold' | 'transiting' | 'completed'
  >('init');

  const [travelingStyle, setTravelingStyle] = useState<React.CSSProperties>({
    display: 'none',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const travelingLogoRef = useRef<HTMLImageElement | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);
  const transitionStartedRef = useRef<boolean>(false);
  const finishedRef = useRef<boolean>(false);

  const finishImmediately = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (safetyTimeoutRef.current) {
      window.clearTimeout(safetyTimeoutRef.current);
    }
    setPhase('completed');
    onComplete();
  }, [onComplete]);

  // Apply calibrated playback rate to speed up video portion by exactly 1,000 ms
  const applyPlaybackRate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const rate = calculatePlaybackRate(video.duration);
    video.defaultPlaybackRate = rate;
    video.playbackRate = rate;
  }, []);

  // Initial check: query param or reduced motion preference
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get('intro') === '1';
    const skipIntro =
      params.get('skipIntro') === '1' || params.get('intro') === '0';

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Respect user skip param or reduced motion (unless forceIntro override is present)
    if ((skipIntro || prefersReducedMotion) && !forceIntro) {
      finishImmediately();
      return;
    }

    setPhase('playing');
    onIntroStart?.();

    // Safety fallback: if video stalls or takes > 5.5s, finish gracefully
    safetyTimeoutRef.current = window.setTimeout(() => {
      finishImmediately();
    }, 5500);

    return () => {
      if (safetyTimeoutRef.current) {
        window.clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, [finishImmediately, onIntroStart]);

  // Lock body scroll while intro is playing or transitioning
  useEffect(() => {
    if (phase !== 'completed') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [phase]);

  // Handle Autoplay & Playback
  useEffect(() => {
    if (phase !== 'playing') return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    // Ensure playback rate is set before playback begins
    applyPlaybackRate();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy -> gracefully bypass
        finishImmediately();
      });
    }
  }, [phase, applyPlaybackRate, finishImmediately]);

  // Start transition from video to navbar
  const startTransition = useCallback(() => {
    if (transitionStartedRef.current || phase === 'transiting' || phase === 'completed') return;
    transitionStartedRef.current = true;

    setPhase('hold');

    // Hold final frame for 250ms, then trigger logo flight
    window.setTimeout(() => {
      const video = videoRef.current;
      const targetLogo = navbarLogoRef.current;

      if (!video || !targetLogo) {
        finishImmediately();
        return;
      }

      const videoRect = video.getBoundingClientRect();
      const containerW = videoRect.width;
      const containerH = videoRect.height;

      // The video is 16:9 and styled with object-fit: contain
      let renderedW: number;
      let renderedH: number;
      let renderedLeft: number;
      let renderedTop: number;

      const videoAspect = 16 / 9;
      const containerAspect = containerW / (containerH || 1);

      if (containerAspect > videoAspect) {
        // Pillarboxed horizontally: video height fills container, width is scaled
        renderedH = containerH;
        renderedW = containerH * videoAspect;
        renderedLeft = videoRect.left + (containerW - renderedW) / 2;
        renderedTop = videoRect.top;
      } else {
        // Letterboxed vertically: video width fills container, height is scaled
        renderedW = containerW;
        renderedH = containerW / videoAspect;
        renderedLeft = videoRect.left;
        renderedTop = videoRect.top + (containerH - renderedH) / 2;
      }

      // In the 16:9 video frame, the scaled logo artwork occupies 29.01% of video width (557px / 1920px) and is centered.
      // In kosha-logo.png, the artwork occupies 94.09% of PNG width (2039 / 2167).
      // Ratio of PNG width to 16:9 video width = (557/1920) / (2039/2167) ≈ 0.30832
      const startWidth = renderedW * 0.30832;
      const startHeight = startWidth * (726 / 2167); // Exact aspect ratio of kosha-logo.png
      const startLeft = renderedLeft + (renderedW - startWidth) / 2;
      const startTop = renderedTop + (renderedH - startHeight) / 2;

      // Position traveling logo initially exactly over the video's final frame
      setTravelingStyle({
        position: 'fixed',
        left: `${startLeft}px`,
        top: `${startTop}px`,
        width: `${startWidth}px`,
        height: `${startHeight}px`,
        opacity: 1,
        transform: 'translate(0px, 0px) scale(1)',
        display: 'block',
      });

      setPhase('transiting');
      onLogoTransitStart?.();

      // Trigger movement to navbar in next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Measure settled target coordinates without ancestor transform distortion
          const freshTargetRect = getSettledTargetRect(targetLogo);
          const targetH = freshTargetRect.height;
          const targetL = freshTargetRect.left;
          const targetT = freshTargetRect.top;

          const deltaX = targetL - startLeft;
          const deltaY = targetT - startTop;
          const scale = targetH / startHeight;

          setTravelingStyle({
            position: 'fixed',
            left: `${startLeft}px`,
            top: `${startTop}px`,
            width: `${startWidth}px`,
            height: `${startHeight}px`,
            opacity: 1,
            transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
            display: 'block',
          });
        });
      });

      // After transit animation ends (850ms), complete the transition
      window.setTimeout(() => {
        setPhase('completed');
        onComplete();
      }, 900);
    }, 280);
  }, [phase, navbarLogoRef, finishImmediately, onLogoTransitStart, onComplete]);

  // Video timeupdate check for near-end detection
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || phase !== 'playing') return;

    if (video.duration && video.currentTime >= video.duration - NEAR_END_OFFSET_SEC) {
      video.pause();
      startTransition();
    }
  };

  const handleLoadedMetadata = () => {
    applyPlaybackRate();
  };

  const handleVideoEnded = () => {
    startTransition();
  };

  const handleVideoError = () => {
    finishImmediately();
  };

  if (phase === 'completed') {
    return null;
  }

  return (
    <>
      <div
        className={`kosha-intro-overlay ${
          phase === 'transiting' ? 'fade-out' : ''
        }`}
        role="region"
        aria-label="KOSHA Cinematic Opening Intro"
      >
        {/* Accessible Skip Button */}
        <button
          type="button"
          className="kosha-intro-skip-btn"
          onClick={finishImmediately}
          aria-label="Skip introductory animation"
        >
          <span>Skip intro</span>
          <span className="kosha-skip-arrow" aria-hidden="true">
            →
          </span>
        </button>

        {/* Video Stage */}
        <div ref={stageRef} className="kosha-intro-stage">
          <video
            ref={videoRef}
            src={videoSrc}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='100%25' height='100%25' fill='%23F5F0E5'/%3E%3C/svg%3E"
            preload="auto"
            className={`kosha-intro-video ${
              phase === 'hold' || phase === 'transiting' ? 'video-fade-out' : ''
            }`}
            muted
            playsInline
            autoPlay
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={applyPlaybackRate}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
        </div>
      </div>

      {/* Traveling Logo (FLIP movement to navbar) */}
      {phase === 'transiting' && (
        <img
          ref={travelingLogoRef}
          src={logoSrc}
          alt="KOSHĀ Logo"
          className="kosha-traveling-logo"
          style={travelingStyle}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default CinematicIntro;
