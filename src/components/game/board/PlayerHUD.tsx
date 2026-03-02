// src/components/game/board/PlayerHUD.tsx
"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { IPlayer } from "@/core/entities/IPlayer";
import { cn } from "@/lib/utils";

interface PlayerHUDProps {
  isOpponent: boolean;
  player: IPlayer;
}

export function PlayerHUD({ isOpponent, player }: PlayerHUDProps) {
  const healthPercentage = Math.max(0, Math.min(100, (player.healthPoints / player.maxHealthPoints) * 100));

  return (
    <motion.div
      initial={{ x: isOpponent ? 50 : -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "absolute z-[100] flex flex-col w-72 pointer-events-none drop-shadow-2xl",
        // EXACTAMENTE en las esquinas opuestas
        isOpponent ? "top-6 right-6 items-end" : "bottom-6 left-6 items-start"
      )}
    >
      <div className="bg-zinc-950/90 border border-zinc-700/50 backdrop-blur-xl px-4 py-1.5 mb-1 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className={cn("absolute inset-0 opacity-20", isOpponent ? "bg-red-500" : "bg-cyan-500")} />
        <span className="font-black tracking-widest text-white uppercase text-sm drop-shadow-md">{player.name}</span>
      </div>

      <div 
        className="w-full h-8 bg-zinc-950/90 border border-white/10 relative backdrop-blur-xl shadow-inner"
        style={{ clipPath: isOpponent ? "polygon(5% 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 95% 0, 100% 100%, 0 100%)" }}
      >
        <motion.div 
          className={cn("h-full absolute top-0", isOpponent ? "bg-red-600 right-0" : "bg-cyan-500 left-0")}
          initial={{ width: "100%" }} animate={{ width: `${healthPercentage}%` }} transition={{ type: "spring", stiffness: 100 }}
          style={{ boxShadow: isOpponent ? "0 0 25px rgba(220,38,38,1)" : "0 0 25px rgba(6,182,212,1)" }}
        />
        <div className={cn("absolute top-1 font-black text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)]", isOpponent ? "right-6" : "left-6")}>
          {player.healthPoints} LP
        </div>
      </div>

      <div className={cn("flex mt-2 space-x-1", isOpponent ? "justify-end" : "justify-start")}>
        <div className="flex items-center bg-zinc-950/90 border border-yellow-500/50 px-4 py-1.5 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Zap className="w-4 h-4 text-yellow-400 mr-2 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
          <span className="text-yellow-400 font-black text-sm">{player.currentEnergy} / {player.maxEnergy}</span>
        </div>
      </div>
    </motion.div>
  );
}