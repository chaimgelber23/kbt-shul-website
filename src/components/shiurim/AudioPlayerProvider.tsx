"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Shiur, PlayerState } from "@/lib/types";
import {
  getShiurProgress,
  saveShiurProgress,
  saveSeriesProgress,
} from "@/lib/progress";

interface AudioPlayerContextType {
  playerState: PlayerState;
  playShiur: (shiur: Shiur, startFromBeginning?: boolean, seriesSlug?: string, nextShiur?: Shiur | null) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  skipBack: () => void;
  skipForward: () => void;
  setPlaybackRate: (rate: number) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentShiur: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextShiurRef = useRef<Shiur | null>(null);
  const seriesSlugRef = useRef<string | null>(null);
  const currentShiurRef = useRef<Shiur | null>(null);
  const progressSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep the ref in sync with state
  useEffect(() => {
    currentShiurRef.current = playerState.currentShiur;
  }, [playerState.currentShiur]);

  // Create audio element ONCE on mount — never recreate
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onPlay = () => setPlayerState((p) => ({ ...p, isPlaying: true }));
    const onPause = () => setPlayerState((p) => ({ ...p, isPlaying: false }));
    const onTimeUpdate = () =>
      setPlayerState((p) => ({ ...p, currentTime: audio.currentTime }));
    const onDurationChange = () =>
      setPlayerState((p) => ({ ...p, duration: audio.duration || 0 }));
    const onEnded = () => {
      setPlayerState((p) => ({ ...p, isPlaying: false, currentTime: 0 }));

      // Mark current shiur as completed (use ref, not stale closure)
      const shiur = currentShiurRef.current;
      if (shiur) {
        saveShiurProgress({
          shiurId: shiur.id,
          seriesSlug: seriesSlugRef.current || undefined,
          currentTime: audio.duration || 0,
          duration: audio.duration || 0,
          lastListened: new Date().toISOString(),
          completed: true,
        });

        if (seriesSlugRef.current) {
          saveSeriesProgress(seriesSlugRef.current, shiur.id);
        }
      }

      // Auto-advance to next shiur if available
      if (nextShiurRef.current) {
        const nextShiur = nextShiurRef.current;
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = nextShiur.audioUrl;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setPlayerState((prev) => ({
              ...prev,
              currentShiur: nextShiur,
              isPlaying: true,
              currentTime: 0,
            }));
          }
        }, 1500);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — create once, never destroy

  // Periodic progress saving (every 5 seconds when playing)
  useEffect(() => {
    if (playerState.isPlaying && playerState.currentShiur && playerState.duration > 0) {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
      }

      progressSaveIntervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        const shiur = currentShiurRef.current;
        if (audio && shiur) {
          const currentTime = audio.currentTime;
          const duration = audio.duration;
          const completed = duration - currentTime < 30;

          saveShiurProgress({
            shiurId: shiur.id,
            seriesSlug: seriesSlugRef.current || undefined,
            currentTime,
            duration,
            lastListened: new Date().toISOString(),
            completed,
          });

          if (seriesSlugRef.current) {
            saveSeriesProgress(seriesSlugRef.current, shiur.id);
          }
        }
      }, 5000);
    } else {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
        progressSaveIntervalRef.current = null;
      }
    }

    return () => {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
      }
    };
  }, [playerState.isPlaying, playerState.currentShiur, playerState.duration]);

  const playShiur = useCallback(
    (shiur: Shiur, startFromBeginning = false, seriesSlug?: string, nextShiur?: Shiur | null) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Store series context and next shiur for auto-advance
      seriesSlugRef.current = seriesSlug || null;
      nextShiurRef.current = nextShiur || null;

      if (currentShiurRef.current?.id === shiur.id) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      } else {
        audio.src = shiur.audioUrl;

        const savedProgress = !startFromBeginning ? getShiurProgress(shiur.id) : null;
        const startTime = savedProgress && !savedProgress.completed ? savedProgress.currentTime : 0;

        audio.currentTime = startTime;
        audio.play();

        setPlayerState((prev) => ({
          ...prev,
          currentShiur: shiur,
          isPlaying: true,
          currentTime: startTime,
        }));
      }
    },
    []
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
  }, []);

  const skipBack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlayerState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setPlayerState({
      currentShiur: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
    });
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        playerState,
        playShiur,
        togglePlayPause,
        seek,
        skipBack,
        skipForward,
        setPlaybackRate,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
