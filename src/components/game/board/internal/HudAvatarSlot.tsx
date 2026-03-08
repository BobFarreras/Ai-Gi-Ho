// src/components/game/board/internal/HudAvatarSlot.tsx - Renderiza retrato vivo en HUD con barra LP diagonal y estado de turno.
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HudAvatarSlotProps {
  isOpponent: boolean;
  playerName: string;
  healthPoints: number;
  maxHealthPoints: number;
  isActiveTurn: boolean;
  avatarUrl?: string | null;
}

export function HudAvatarSlot({ isOpponent, playerName, healthPoints, maxHealthPoints, isActiveTurn, avatarUrl }: HudAvatarSlotProps) {
  const fallback = playerName.slice(0, 2).toUpperCase();
  const healthPercent = Math.max(0, Math.min(100, (healthPoints / maxHealthPoints) * 100));
  return (
    <motion.div
      animate={{ scale: isActiveTurn ? [1, 1.015, 1] : 1 }}
      transition={{ duration: 1.8, repeat: isActiveTurn ? Infinity : 0, ease: "easeInOut" }}
      className={cn(
        "relative h-[122px] w-[122px] shrink-0 overflow-hidden bg-transparent",
        isOpponent ? "[clip-path:polygon(10%_0,100%_0,100%_90%,0_100%,0_10%)]" : "[clip-path:polygon(0_0,90%_0,100%_10%,100%_100%,10%_100%,0_90%)]",
      )}
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt={`Avatar de ${playerName}`} fill sizes="122px" className="object-cover drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-black uppercase tracking-[0.15em] text-cyan-100">{fallback}</div>
      )}
      <div className={cn("absolute inset-x-0 bottom-3 h-4 -rotate-[13deg] overflow-hidden border border-white/80 bg-black/45", isOpponent ? "-left-2" : "-right-2")}>
        <div className={cn("absolute inset-y-0", isOpponent ? "right-0 bg-red-500" : "left-0 bg-cyan-400")} style={{ width: `${healthPercent}%` }} />
        <p className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-[0.12em] text-white drop-shadow-[0_0_6px_rgba(0,0,0,1)]">LP: {healthPoints}</p>
      </div>
      <div className={cn("absolute -bottom-8 left-0 right-0 text-center text-white", isOpponent ? "text-right pr-1" : "text-left pl-1")}>
        <p className="truncate text-[11px] font-black uppercase tracking-[0.15em]">{playerName}</p>
        <p className={cn("text-[10px] font-black uppercase tracking-[0.14em]", isActiveTurn ? "text-cyan-200" : "text-zinc-300")}>{isActiveTurn ? "Turno Activo" : "En Espera"}</p>
      </div>
    </motion.div>
  );
}
