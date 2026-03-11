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
  const frontFaceSrc = starterSide === "PLAYER" ? playerAvatarUrl : opponentAvatarUrl;
  const backFaceSrc = starterSide === "PLAYER" ? opponentAvatarUrl : playerAvatarUrl;
  const [stage, setStage] = useState<"SPIN" | "REVEAL" | "TRAVEL">("SPIN");
  const travelOffset = useMemo(
    () =>
      starterSide === "PLAYER"
        ? { x: typeof window !== "undefined" ? -window.innerWidth * 0.36 : -420, y: typeof window !== "undefined" ? window.innerHeight * 0.34 : 280 }
        : { x: typeof window !== "undefined" ? window.innerWidth * 0.36 : 420, y: typeof window !== "undefined" ? -window.innerHeight * 0.34 : -280 },
    [starterSide],
  );
  useEffect(() => {
    if (!isVisible) return;
    const resetTimeout = window.setTimeout(() => setStage("SPIN"), 0);
    const playSfx = (path: string) => {
      const audio = new Audio(path);
      audio.volume = 0.72;
      void audio.play().catch(() => undefined);
    };
    const introTimeout = window.setTimeout(() => {
      playSfx("/audio/story/effects/intro-coinToss.mp3");
    }, 120);
    const revealTimeout = window.setTimeout(() => setStage("REVEAL"), 5280);
    const travelTimeout = window.setTimeout(() => {
      playSfx("/audio/story/effects/final-coinToss.mp3");
      setStage("TRAVEL");
    }, 6720);
    const closeTimeout = window.setTimeout(() => onComplete?.(), 7920);
    return () => {
      window.clearTimeout(resetTimeout);
      window.clearTimeout(introTimeout);
      window.clearTimeout(revealTimeout);
      window.clearTimeout(travelTimeout);
      window.clearTimeout(closeTimeout);
    };
  }, [isVisible, onComplete]);
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 z-[320] flex items-center justify-center bg-black/45 backdrop-blur-md">
      <div className="text-center">
        <motion.div
          className="relative mx-auto h-48 w-48 [perspective:1400px]"
          initial={false}
          animate={
            stage === "SPIN"
              ? { rotateY: 3600, scale: 1.12, x: 0, y: 0, opacity: 1 }
              : stage === "REVEAL"
                ? { rotateY: 0, scale: 1.12, x: 0, y: 0, opacity: 1 }
                : { rotateY: 0, scale: 0.26, x: travelOffset.x, y: travelOffset.y, opacity: 0.92 }
          }
          transition={
            stage === "SPIN"
              ? { duration: 5.1, ease: "easeInOut" }
              : stage === "REVEAL"
                ? { duration: 0.92, ease: "easeOut" }
                : { duration: 1.12, ease: "easeInOut" }
          }
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 rounded-full border border-cyan-300/65 bg-cyan-950/55 shadow-[0_0_34px_rgba(34,211,238,0.45)] [backface-visibility:hidden]">
            <Image src={frontFaceSrc} alt="Cara ganadora" fill sizes="192px" quality={55} className="rounded-full object-cover p-2" />
          </div>
          <div className="absolute inset-0 rounded-full border border-rose-300/65 bg-rose-950/55 shadow-[0_0_34px_rgba(251,113,133,0.38)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Image src={backFaceSrc} alt="Cara opuesta" fill sizes="192px" quality={55} className="rounded-full object-cover p-2" />
          </div>
        </motion.div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-cyan-100">
          {stage === "SPIN" ? "Lanzando moneda..." : `Empieza: ${winnerLabel}`}
        </p>
      </div>
    </div>
  );
}
