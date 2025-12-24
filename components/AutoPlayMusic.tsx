"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface Props {
  src: string;
  volume?: number; // target volume
  fadeDuration?: number; // ms
}

export default function GlobalAutoPlayMusic({
  src,
  volume = 0.2,
  fadeDuration = 1500,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  // ---------- CLEAR FADE ----------
  const clearFade = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  // ---------- FADE IN ----------
  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();

    const step = volume / (fadeDuration / 50);

    fadeRef.current = setInterval(() => {
      audio.volume = Math.min(audio.volume + step, volume);
      if (audio.volume >= volume) clearFade();
    }, 50);
  };

  // ---------- FADE OUT ----------
  const fadeOut = (onEnd?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();

    const step = audio.volume / (fadeDuration / 50);

    fadeRef.current = setInterval(() => {
      audio.volume = Math.max(audio.volume - step, 0);

      if (audio.volume <= 0) {
        clearFade();
        audio.pause();
        onEnd?.();
      }
    }, 50);
  };

  // ---------- START MUSIC (FIRST USER GESTURE) ----------
  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || started) return;

    audio.muted = false;
    audio.play(); // HARUS sync
    fadeIn();

    setIsPlaying(true);
    setStarted(true);
  };

  // ---------- GLOBAL USER GESTURE ----------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.volume = 0;

    const handler = () => {
      startMusic();
      remove();
    };

    const remove = () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("touchstart", handler);
    };

    document.addEventListener("pointerdown", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });

    return () => remove();
  }, []);

  // ---------- TOGGLE PLAY / PAUSE ----------
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play(); // user gesture via button
      fadeIn();
      setIsPlaying(true);
    } else {
      fadeOut(() => setIsPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />

      {/* PLAY / PAUSE BUTTON */}
      <button
        type="button"
        onClick={togglePlay}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full
                   bg-white shadow-lg flex items-center justify-center
                   text-muted-foreground"
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
}
