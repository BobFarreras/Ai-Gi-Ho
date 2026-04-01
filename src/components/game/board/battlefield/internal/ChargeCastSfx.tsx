// src/components/game/board/battlefield/internal/ChargeCastSfx.tsx - Reproduce sonido de carga al iniciar efectos con preparación.
"use client";

import { useEffect } from "react";

interface IChargeCastSfxProps {
  enabled: boolean;
  playKey?: string;
  path?: string;
  fallbackPath?: string;
  volume?: number;
}

const lastPlayedByKey = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1800;

/** Dispara audio corto de carga al montar un efecto visual. */
export function ChargeCastSfx({
  enabled,
  playKey,
  path = "/audio/sfx/effects/execution/cargar.mp3",
  fallbackPath = "/audio/sfx/cargar.mp3",
  volume = 0.76,
}: IChargeCastSfxProps) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof window.Audio === "undefined") return;
    if (playKey) {
      const now = Date.now();
      const lastPlayedAt = lastPlayedByKey.get(playKey) ?? 0;
      if (now - lastPlayedAt < DEDUPE_WINDOW_MS) return;
      lastPlayedByKey.set(playKey, now);
    }
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = normalizedVolume;
    audio.onerror = () => {
      if (!fallbackPath) return;
      const fallback = new Audio(fallbackPath);
      fallback.preload = "auto";
      fallback.loop = false;
      fallback.volume = normalizedVolume;
      const fallbackResult = fallback.play();
      if (fallbackResult && typeof fallbackResult.catch === "function") fallbackResult.catch(() => undefined);
    };
    const result = audio.play();
    if (result && typeof result.catch === "function") result.catch(() => undefined);
    // No pausamos en unmount para no cortar el SFX en activaciones rápidas.
    return;
  }, [enabled, fallbackPath, path, playKey, volume]);
  return null;
}
