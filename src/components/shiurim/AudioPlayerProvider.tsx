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

interface AudioPlayerContextType {
  playerState: PlayerState;
  playShiur: (shiur: Shiur) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
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

  // Create audio element once on mount
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
    const onEnded = () =>
      setPlayerState((p) => ({ ...p, isPlaying: false, currentTime: 0 }));

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
  }, []);

  const playShiur = useCallback(
    (shiur: Shiur) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (playerState.currentShiur?.id === shiur.id) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      } else {
        audio.src = shiur.audioUrl;
        audio.play();
        setPlayerState((prev) => ({
          ...prev,
          currentShiur: shiur,
          isPlaying: true,
          currentTime: 0,
        }));
      }
    },
    [playerState.currentShiur?.id]
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
        setPlaybackRate,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
