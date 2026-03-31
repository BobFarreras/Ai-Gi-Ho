// src/components/game/board/ui/overlays/internal/DirectDamageBeamOverlay.tsx - Overlay global para daño directo por efecto con carga de humo, rayo y sincronía de audio.
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ICombatLogEvent } from "@/core/entities/ICombatLog";
import { DIRECT_DAMAGE_BEAM_MS, DIRECT_DAMAGE_BEAM_START_MS } from "@/core/config/direct-damage-vfx";

interface IDirectDamageBeamOverlayProps { events: ICombatLogEvent[]; playerAId: string; }
interface IDirectDamageSignal { id: string; towardsPlayer: boolean; }
interface IPoint { x: number; y: number; }

function readTargetPlayerId(event: ICombatLogEvent): string | null {
  const payload = typeof event.payload === "object" && event.payload !== null ? (event.payload as Record<string, unknown>) : null;
  return payload && typeof payload.targetPlayerId === "string" ? payload.targetPlayerId : null;
}

function resolveLatestEffectDamageSignal(events: ICombatLogEvent[], playerAId: string): IDirectDamageSignal | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    if (events[index].eventType !== "DIRECT_DAMAGE") continue;
    const targetPlayerId = readTargetPlayerId(events[index]);
    if (!targetPlayerId) continue;
    const markerA = events[index - 1]?.eventType;
    const markerB = events[index - 2]?.eventType;
    const comesFromAttack = markerA === "ATTACK_DECLARED" || markerA === "BATTLE_RESOLVED" || markerB === "ATTACK_DECLARED";
    if (comesFromAttack) return null;
    return { id: events[index].id, towardsPlayer: targetPlayerId === playerAId };
  }
  return null;
}

function resolvePoints(towardsPlayer: boolean): { source: IPoint; control: IPoint; target: IPoint } {
  if (towardsPlayer) return { source: { x: 560, y: 420 }, control: { x: 415, y: 600 }, target: { x: 186, y: 835 } };
  return { source: { x: 440, y: 580 }, control: { x: 615, y: 345 }, target: { x: 814, y: 166 } };
}

function play(path: string, volume: number): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof window.Audio === "undefined") return null;
  const audio = new Audio(path);
  audio.preload = "auto";
  audio.loop = false;
  audio.volume = Math.max(0, Math.min(1, volume));
  const result = audio.play();
  if (result && typeof result.catch === "function") result.catch(() => undefined);
  return audio;
}

export function DirectDamageBeamOverlay({ events, playerAId }: IDirectDamageBeamOverlayProps) {
  const signal = resolveLatestEffectDamageSignal(events, playerAId);
  const signalId = signal?.id ?? null;

  useEffect(() => {
    if (!signalId) return;
    const chargeAudio = play("/audio/sfx/cargar.mp3", 0.78);
    const beamTimer = window.setTimeout(() => {
      chargeAudio?.pause();
      play("/audio/sfx/damage.mp3", 0.82);
    }, DIRECT_DAMAGE_BEAM_START_MS);
    const impactTimer = window.setTimeout(() => {
      play("/audio/sfx/damage.mp3", 0.64);
    }, DIRECT_DAMAGE_BEAM_START_MS + DIRECT_DAMAGE_BEAM_MS);
    return () => {
      window.clearTimeout(beamTimer);
      window.clearTimeout(impactTimer);
      chargeAudio?.pause();
    };
  }, [signalId]);

  if (!signal) return null;

  const trajectory = resolvePoints(signal.towardsPlayer);
  const beamPath = `M ${trajectory.source.x} ${trajectory.source.y} Q ${trajectory.control.x} ${trajectory.control.y} ${trajectory.target.x} ${trajectory.target.y}`;

  return (
    <div key={signal.id} className="pointer-events-none absolute inset-0 z-[360] overflow-hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`smoke-${index}`}
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: [0, 0.8, 0], y: [8, -30, -58], scale: [0.8, 1.15, 1.42] }}
          transition={{ duration: 0.28 + index * 0.03, delay: index * 0.05, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-10 w-7 rounded-full bg-gradient-to-t from-amber-500/70 via-orange-300/70 to-slate-100/45 blur-md"
          style={{ x: trajectory.source.x - 510 + (index % 3) * 10, y: trajectory.source.y - 510 + Math.floor(index / 3) * 10 }}
        />
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: trajectory.source.x - 500, y: trajectory.source.y - 500 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.95] }}
        transition={{ duration: DIRECT_DAMAGE_BEAM_START_MS / 1000, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-400/80 via-orange-200/90 to-cyan-200/80 blur-sm"
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <motion.path
          d={beamPath}
          fill="none"
          stroke="rgba(254,242,242,0.96)"
          strokeWidth={9}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
          transition={{ duration: DIRECT_DAMAGE_BEAM_MS / 1000, delay: DIRECT_DAMAGE_BEAM_START_MS / 1000, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 16px rgba(239,68,68,0.95)) drop-shadow(0 0 24px rgba(34,211,238,0.66))" }}
        />
        <motion.path
          d={beamPath}
          fill="none"
          stroke="rgba(248,113,113,0.72)"
          strokeWidth={16}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.85, 0] }}
          transition={{ duration: DIRECT_DAMAGE_BEAM_MS / 1000, delay: DIRECT_DAMAGE_BEAM_START_MS / 1000, ease: "easeInOut" }}
          style={{ filter: "blur(1.2px)" }}
        />
      </svg>
    </div>
  );
}
