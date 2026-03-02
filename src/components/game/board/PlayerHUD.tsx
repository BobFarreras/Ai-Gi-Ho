// src/components/game/Board/PlayerHUD.tsx
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
        "absolute z-40 flex flex-col w-64 pointer-events-none",
        isOpponent ? "top-4 right-4 items-end" : "bottom-32 left-4 items-start"
      )}
    >
      {/* Etiqueta de Nombre con estilo Tech */}
      <div className="bg-zinc-950/80 border border-zinc-700 backdrop-blur-md px-4 py-1 mb-1 relative overflow-hidden">
        <div className={cn("absolute inset-0 opacity-20", isOpponent ? "bg-red-500" : "bg-cyan-500")} />
        <span className="font-black tracking-widest text-white uppercase text-sm">{player.name}</span>
      </div>

      {/* Barra de Vida Angular (Clip Path) */}
      <div 
        className="w-full h-8 bg-zinc-900/90 border border-zinc-800 relative backdrop-blur-md"
        style={{ clipPath: isOpponent ? "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 90% 0, 100% 100%, 0 100%)" }}
      >
        {/* Fill Animado */}
        <motion.div 
          className={cn("h-full absolute top-0", isOpponent ? "bg-red-600 right-0" : "bg-cyan-500 left-0")}
          initial={{ width: "100%" }}
          animate={{ width: `${healthPercentage}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{ boxShadow: isOpponent ? "0 0 20px rgba(220,38,38,0.8)" : "0 0 20px rgba(6,182,212,0.8)" }}
        />
        <div className={cn("absolute top-1 font-black text-white text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,1)]", isOpponent ? "right-6" : "left-6")}>
          {player.healthPoints} LP
        </div>
      </div>

      {/* Indicador de Energía (Maná) */}
      <div className={cn("flex mt-2 space-x-1", isOpponent ? "justify-end" : "justify-start")}>
        <div className="flex items-center bg-zinc-950/80 border border-yellow-500/30 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.2)]">
          <Zap className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-yellow-400 font-bold text-sm">{player.currentEnergy} / {player.maxEnergy}</span>
        </div>
      </div>
    </motion.div>
  );
}