// src/app/hub/story/chapter/[chapter]/duel/[duelIndex]/StoryDuelCoinTossOverlay.tsx - Overlay inicial de moneda para decidir quién comienza el duelo Story.
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface IStoryDuelCoinTossOverlayProps {
  isVisible: boolean;
  starterSide: "PLAYER" | "OPPONENT";
  playerName: string;
  opponentName: string;
  playerAvatarUrl: string;
  opponentAvatarUrl: string;
}

export function StoryDuelCoinTossOverlay({
  isVisible,
  starterSide,
  playerName,
  opponentName,
  playerAvatarUrl,
  opponentAvatarUrl,
}: IStoryDuelCoinTossOverlayProps) {
  if (!isVisible) return null;
  const winnerLabel = starterSide === "PLAYER" ? playerName : opponentName;
  const faceSrc = starterSide === "PLAYER" ? playerAvatarUrl : opponentAvatarUrl;
  return (
    <div className="absolute inset-0 z-[320] flex items-center justify-center bg-black/72 backdrop-blur-sm">
      <div className="rounded-2xl border border-cyan-400/35 bg-[#020812]/88 px-8 py-7 text-center shadow-[0_0_34px_rgba(6,182,212,0.22)]">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300/90">Inicio de Duelo</p>
        <motion.div
          className="relative mx-auto mt-4 h-24 w-24 rounded-full border border-cyan-300/60 bg-cyan-950/50"
          initial={{ rotateY: 0, scale: 0.82 }}
          animate={{ rotateY: 1080, scale: 1 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
        >
          <Image src={faceSrc} alt="Cara de moneda" fill sizes="96px" quality={55} className="rounded-full object-cover p-1.5" />
        </motion.div>
        <p className="mt-4 text-xs font-black uppercase tracking-wider text-cyan-100">Empieza: {winnerLabel}</p>
      </div>
    </div>
  );
}
