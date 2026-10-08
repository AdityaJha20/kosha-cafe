import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './BackgroundMusic.module.css';

const AUDIO_SRC = '/audio/kosha-ambient.mp3';
const TARGET_VOLUME = 0.15; // Subtle atmospheric volume within requested 0.10–0.15 range
const FADE_IN_MS = 600;
const FADE_OUT_MS = 400;

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  // Clear any active fade interval
  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  // Smooth volume interpolation using elapsed performance.now()
  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      targetVolume: number,
      durationMs: number,
      onComplete?: () => void
    ) => {
      clearFadeTimer();
      const startVolume = audio.volume;
      const startTime = performance.now();

      fadeTimerRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const currentVol = startVolume + (targetVolume - startVolume) * progress;

        try {
          audio.volume = Math.max(0, Math.min(1, currentVol));
        } catch {
          // Setting volume may throw or be ignored on some mobile platforms (e.g. iOS)
        }

        if (progress >= 1) {
          clearFadeTimer();
          try {
            audio.volume = targetVolume;
          } catch {
            // Ignore volume lockdown
          }
          onComplete?.();
        }
      }, 20);
    },
    [clearFadeTimer]
  );

  // Main toggle handler triggered by user gesture
  const handleToggle = async () => {
    if (isPlaying) {
      // 1. Fade volume down
      // 2. Pause the audio
      // 3. Update UI to OFF
      setIsPlaying(false);
      const audio = audioRef.current;
      if (audio) {
        fadeVolume(audio, 0, FADE_OUT_MS, () => {
          audio.pause();
        });
      }
    } else {
      // 1. Create or reuse the Audio instance
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(AUDIO_SRC);
        audio.preload = 'metadata';
        audioRef.current = audio;
      }

      // 2. Set the correct source and ensure loop & not muted
      audio.loop = true;
      audio.muted = false;

      // 3. Set volume initially to 0
      try {
        audio.volume = 0;
      } catch {
        // Fallback for mobile
      }

      // 4. Call play() with full promise handling
      try {
        await audio.play();

        // 5. If play succeeds, fade volume to 0.10–0.15 and update UI to ON
        setIsPlaying(true);
        fadeVolume(audio, TARGET_VOLUME, FADE_IN_MS);
      } catch (err) {
        console.warn(
          'Background music could not start. User interaction may be required.',
          err
        );
        setIsPlaying(false);
      }
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearFadeTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearFadeTimer]);

  return (
    <div className={styles.musicControlWrapper}>
      <button
        type="button"
        className={`${styles.musicButton} ${isPlaying ? styles.isPlaying : ''}`}
        onClick={handleToggle}
        aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Turn background music off' : 'Turn background music on'}
      >
        {isPlaying ? (
          /* Sound ON: Speaker with gentle acoustic waves */
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
            <polygon
              points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              fill="currentColor"
              fillOpacity="0.12"
            />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6" />
          </svg>
        ) : (
          /* Sound OFF: Speaker with subtle muted cross */
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
            <polygon
              points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              fill="currentColor"
              fillOpacity="0.12"
            />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
