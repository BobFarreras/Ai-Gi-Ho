// src/app/hub/story/chapter/[chapter]/duel/[duelIndex]/StoryDuelCoinTossOverlay.tsx - Overlay inicial de moneda para decidir quién comienza el duelo Story.
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface IStoryDuelCoinTossOverlayProps {
  isVisible: boolean;
  starterSide: "PLAYER" | "OPPONENT";
  playerName: string;
  opponentName: string;
  playerAvatarUrl: string;
  opponentAvatarUrl: string;
  onComplete?: () => void;
}

export function StoryDuelCoinTossOverlay({
  isVisible,
  starterSide,
  playerName,
  opponentName,
  playerAvatarUrl,
  opponentAvatarUrl,
  onComplete,
}: IStoryDuelCoinTossOverlayProps) {
  const winnerLabel = starterSide === "PLAYER" ? playerName : opponentName;
  const revealRotation = starterSide === "PLAYER" ? 0 : 180;
  const [stage, setStage] = useState<"READY" | "SPIN" | "REVEAL" | "TRAVEL">("READY");
  const travelOffset = useMemo(
    () =>
      starterSide === "PLAYER"
        ? { x: typeof window !== "undefined" ? -window.innerWidth * 0.36 : -420, y: typeof window !== "undefined" ? window.innerHeight * 0.34 : 280 }
        : { x: typeof window !== "undefined" ? window.innerWidth * 0.36 : 420, y: typeof window !== "undefined" ? -window.innerHeight * 0.34 : -280 },
    [starterSide],
  );
  useEffect(() => {
    if (!isVisible) return;
    const playSfx = (path: string) => {
      const audio = new Audio(path);
      audio.volume = 0.72;
      void audio.play().catch(() => undefined);
    };
    const spinTimeout = window.setTimeout(() => {
      setStage("SPIN");
      playSfx("/audio/story/effects/intro-coinToss.mp3");
    }, 320);
    const revealTimeout = window.setTimeout(() => setStage("REVEAL"), 3100);
    const travelTimeout = window.setTimeout(() => {
      playSfx("/audio/story/effects/final-coinToss.mp3");
      setStage("TRAVEL");
    }, 4500);
    const closeTimeout = window.setTimeout(() => onComplete?.(), 5450);
    return () => {
      window.clearTimeout(spinTimeout);
      window.clearTimeout(revealTimeout);
      window.clearTimeout(travelTimeout);
      window.clearTimeout(closeTimeout);
    };
  }, [isVisible, onComplete]);
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 z-[320] flex items-center justify-center bg-black/72 backdrop-blur-sm">
      <div className="rounded-2xl border border-cyan-400/35 bg-[#020812]/88 px-8 py-7 text-center shadow-[0_0_34px_rgba(6,182,212,0.22)]">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300/90">Inicio de Duelo</p>
        <motion.div
          className="relative mx-auto mt-4 h-24 w-24 [perspective:1000px]"
          initial={false}
          animate={
            stage === "READY"
              ? { rotateY: 0, scale: 0.92, x: 0, y: 0, opacity: 1 }
              : stage === "SPIN"
              ? { rotateY: 1440, scale: 1.08, x: 0, y: 0, opacity: 1 }
              : stage === "REVEAL"
                ? { rotateY: revealRotation, scale: 1.08, x: 0, y: 0, opacity: 1 }
                : { rotateY: revealRotation, scale: 0.24, x: travelOffset.x, y: travelOffset.y, opacity: 0.92 }
          }
          transition={
            stage === "READY"
              ? { duration: 0.2, ease: "easeOut" }
              : stage === "SPIN"
                ? { duration: 2.45, ease: "easeInOut" }
                : stage === "REVEAL"
                  ? { duration: 0.65, ease: "easeOut" }
                  : { duration: 0.9, ease: "easeInOut" }
          }
        >
          <div className="absolute inset-0 rounded-full border border-cyan-300/60 bg-cyan-950/50 shadow-[0_0_20px_rgba(34,211,238,0.35)] [backface-visibility:hidden]">
            <Image src={playerAvatarUrl} alt="Cara jugador" fill sizes="96px" quality={55} className="rounded-full object-cover p-1.5" />
          </div>
          <div className="absolute inset-0 rounded-full border border-rose-300/60 bg-rose-950/50 shadow-[0_0_20px_rgba(251,113,133,0.3)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Image src={opponentAvatarUrl} alt="Cara oponente" fill sizes="96px" quality={55} className="rounded-full object-cover p-1.5" />
          </div>
        </motion.div>
        <p className="mt-4 text-xs font-black uppercase tracking-wider text-cyan-100">
          {stage === "READY" || stage === "SPIN" ? "Lanzando moneda..." : `Empieza: ${winnerLabel}`}
        </p>
      </div>
    </div>
  );
}
