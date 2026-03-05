// src/components/hub/home/HomeEvolutionOverlay.tsx - Overlay cinemático para visualizar evolución de versión y fusión de copias.
"use client";

import { motion } from "framer-motion";
import { ICard } from "@/core/entities/ICard";
import { Card } from "@/components/game/card/Card";

interface HomeEvolutionOverlayProps {
  card: ICard | null;
  fromVersionTier: number;
  toVersionTier: number;
  level: number;
  consumedCopies: number;
}

function resolveGlowClass(versionTier: number): string {
  if (versionTier >= 5) return "shadow-[0_0_90px_rgba(245,158,11,0.8)]";
  if (versionTier >= 4) return "shadow-[0_0_80px_rgba(236,72,153,0.75)]";
  if (versionTier >= 3) return "shadow-[0_0_70px_rgba(168,85,247,0.72)]";
  if (versionTier >= 2) return "shadow-[0_0_60px_rgba(56,189,248,0.7)]";
  return "shadow-[0_0_50px_rgba(34,211,238,0.65)]";
}

export function HomeEvolutionOverlay({
  card,
  fromVersionTier,
  toVersionTier,
  level,
  consumedCopies,
}: HomeEvolutionOverlayProps) {
  if (!card) return null;
  const visualCopies = Math.max(3, Math.min(consumedCopies, 10));
  return (
    <div className="pointer-events-none absolute inset-0 z-[420] flex items-center justify-center bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0.4, scale: 0.6 }}
          animate={{ opacity: [0.4, 0.85, 0.45], scale: [0.6, 1.35, 1.1] }}
          transition={{ duration: 1.4, times: [0, 0.55, 1], repeat: 1 }}
          className="absolute h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.4),transparent_65%)] blur-2xl"
        />
        <div className="mb-4 flex items-center gap-3 rounded border border-cyan-500/35 bg-[#020c18]/85 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
          <span>Version</span>
          <span className="text-amber-300">V{fromVersionTier}</span>
          <span className="text-cyan-400">→</span>
          <span className="text-amber-200">V{toVersionTier}</span>
        </div>
        <div className="relative mb-5 h-10 w-80">
          {Array.from({ length: visualCopies }).map((_, index) => (
            <motion.div
              key={`copy-fusion-${index}`}
              initial={{ opacity: 0, y: 24, scale: 0.55, x: (index - visualCopies / 2) * 22 }}
              animate={{ opacity: [0, 1, 0], y: [24, -6, -36], scale: [0.55, 1, 0.65], x: [((index - visualCopies / 2) * 22), 0, 0] }}
              transition={{ duration: 0.9, delay: index * 0.05 }}
              className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full border border-amber-300/80 bg-amber-300/35"
            />
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.72, rotate: -2 }}
          animate={{ scale: [0.72, 1.08, 1], rotate: [-2, 2, 0] }}
          transition={{ duration: 1.2, times: [0, 0.65, 1] }}
          className={resolveGlowClass(toVersionTier)}
        >
          <Card card={card} versionTier={toVersionTier} level={level} />
        </motion.div>
      </motion.div>
    </div>
  );
}
