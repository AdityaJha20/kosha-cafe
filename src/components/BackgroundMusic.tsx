import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './BackgroundMusic.module.css';

const AUDIO_SRC = '/audio/kosha-ambient.mp3';
const TARGET_VOLUME = 0.12; // Subtle background level (within 0.10–0.15)
const FADE_IN_DURATION_MS = 500;
const FADE_OUT_DURATION_MS = 400;
const SESSION_STORAGE_KEY = 'kosha_ambient_sound_enabled';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  // Clear any ongoing fade interpolation
  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  // Smooth fade-in
  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    clearFadeTimer();
    const intervalMs = 25;
    const steps = Math.max(1, Math.floor(FADE_IN_DURATION_MS / intervalMs));
    const stepIncrement = TARGET_VOLUME / steps;

    fadeTimerRef.current = window.setInterval(() => {
      const nextVolume = audio.volume + stepIncrement;
      if (nextVolume >= TARGET_VOLUME) {
        audio.volume = TARGET_VOLUME;
        clearFadeTimer();
      } else {
        audio.volume = nextVolume;
      }
    }, intervalMs);
  }, [clearFadeTimer]);

  // Smooth fade-out followed by pause
  const fadeOut = useCallback((audio: HTMLAudioElement, onDone?: () => void) => {
    clearFadeTimer();
    const intervalMs = 25;
    const currentVol = audio.volume;
    const steps = Math.max(1, Math.floor(FADE_OUT_DURATION_MS / intervalMs));
    const stepDecrement = currentVol / steps;

    fadeTimerRef.current = window.setInterval(() => {
      const nextVolume = audio.volume - stepDecrement;
      if (nextVolume <= 0.005) {
        audio.volume = 0;
        audio.pause();
        clearFadeTimer();
        onDone?.();
      } else {
        audio.volume = nextVolume;
      }
    }, intervalMs);
  }, [clearFadeTimer]);

  // Audio start action
  const startAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      fadeIn(audio);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } catch {
        // Storage access may fail in restricted/private browsing modes
      }
    } catch {
      // Autoplay or playback rejected by browser policy
      setIsPlaying(false);
    }
  }, [fadeIn]);

  // Audio stop action
  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'false');
    } catch {
      // Storage access may fail
    }

    fadeOut(audio);
  }, [fadeOut]);

  // Toggle handler
  const handleToggle = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Restore session preference on user interaction if previously enabled in session
  useEffect(() => {
    let savedPreference: string | null = null;
    try {
      savedPreference = sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      savedPreference = null;
    }

    if (savedPreference === 'true') {
      const handleFirstInteraction = () => {
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        startAudio();
      };

      window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });

      return () => {
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [startAudio]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      clearFadeTimer();
      if (audio) {
        audio.pause();
      }
    };
  }, [clearFadeTimer]);

  return (
    <div className={styles.musicControlWrapper}>
      {/* Hidden native HTML Audio element */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="metadata"
        aria-hidden="true"
      />

      {/* Understated KOSHA Audio Toggle Button */}
      <button
        type="button"
        className={`${styles.musicButton} ${isPlaying ? styles.isPlaying : ''}`}
        onClick={handleToggle}
        aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      >
        {isPlaying ? (
          /* Sound ON Icon: minimalist speaker with subtle acoustic waves */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.12" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6" />
          </svg>
        ) : (
          /* Sound OFF Icon: minimalist speaker with subtle muted cross */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.12" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
