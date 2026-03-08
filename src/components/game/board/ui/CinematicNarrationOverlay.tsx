// src/components/game/board/ui/CinematicNarrationOverlay.tsx - Overlay de diálogo especial que entra desde lateral con retrato y texto de evento narrativo.
"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IResolvedNarrationAction } from "@/components/game/board/narration/types";

interface CinematicNarrationOverlayProps {
  action: IResolvedNarrationAction | null;
  playerId: string;
  playerAvatarUrl?: string | null;
  opponentAvatarUrl?: string | null;
}

export function CinematicNarrationOverlay({ action, playerId, playerAvatarUrl, opponentAvatarUrl }: CinematicNarrationOverlayProps) {
  if (!action) return null;
  const isPlayerActor = action.actorPlayerId === playerId;
  const avatarUrl = action.line.portraitUrl ?? (isPlayerActor ? playerAvatarUrl : opponentAvatarUrl);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${action.line.id}-${action.sourceEvent?.id ?? "result"}`}
        initial={{ opacity: 0, x: isPlayerActor ? -80 : 80, y: isPlayerActor ? 12 : -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isPlayerActor ? -60 : 60 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className={`pointer-events-none absolute z-[176] ${isPlayerActor ? "bottom-24 left-6" : "top-14 right-6"}`}
      >
        <div className={`flex max-w-[min(88vw,560px)] items-end gap-3 ${isPlayerActor ? "flex-row" : "flex-row-reverse"}`}>
          <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden [clip-path:polygon(8%_0,100%_0,100%_92%,0_100%,0_8%)]">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Retrato de duelista" fill sizes="140px" className="object-cover drop-shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-black uppercase tracking-[0.15em] text-cyan-100">{isPlayerActor ? "YOU" : "CPU"}</div>
            )}
          </div>
          <div className="relative rounded-xl border-2 border-black bg-white px-4 py-3 text-left text-black shadow-[0_8px_0_rgba(0,0,0,0.9)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70">{isPlayerActor ? "Arquitecto" : "Oponente"}</p>
            <p className="text-sm font-black leading-snug">{action.line.text}</p>
            <span className={`absolute top-full h-3 w-3 -mt-[7px] rotate-45 border-b-2 border-r-2 border-black bg-white ${isPlayerActor ? "left-6" : "right-6"}`} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
