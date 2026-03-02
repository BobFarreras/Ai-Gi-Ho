// src/components/game/card/Card.tsx
"use client";

import { motion } from "framer-motion";
import { Shield, Sword, Zap, Cpu } from "lucide-react";
import { ICard, Faction } from "@/core/entities/ICard";
import { BattleMode } from "@/core/entities/IPlayer";
import { cn } from "@/lib/utils";

const FACTION_STYLES: Record<Faction, { wrapper: string; inner: string }> = {
  OPEN_SOURCE: { wrapper: "bg-gradient-to-br from-emerald-400 to-emerald-900 shadow-emerald-500/30", inner: "from-emerald-950 via-zinc-950 to-black" },
  BIG_TECH: { wrapper: "bg-gradient-to-br from-blue-400 to-blue-900 shadow-blue-500/30", inner: "from-blue-950 via-zinc-950 to-black" },
  NO_CODE: { wrapper: "bg-gradient-to-br from-purple-400 to-purple-900 shadow-purple-500/30", inner: "from-purple-950 via-zinc-950 to-black" },
  NEUTRAL: { wrapper: "bg-gradient-to-br from-zinc-400 to-zinc-700 shadow-zinc-500/30", inner: "from-zinc-900 via-zinc-950 to-black" },
};

interface CardProps {
  card: ICard;
  onClick?: (card: ICard) => void;
  isSelected?: boolean;
  boardMode?: BattleMode; 
}

export function Card({ card, onClick, isSelected = false, boardMode }: CardProps) {
  const faction = FACTION_STYLES[card.faction] || FACTION_STYLES.NEUTRAL;

  const clipPathOuter = "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";
  const clipPathInner = "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)";

  const isOnBoard = boardMode === 'ATTACK' || boardMode === 'DEFENSE' || boardMode === 'SET' || boardMode === 'ACTIVATE';
  const isDefense = boardMode === 'DEFENSE' || boardMode === 'SET';
  const isExecution = card.type === 'EXECUTION';

  return (
    <div className="relative w-[260px] h-[340px] group/card" style={{ transformStyle: "preserve-3d" }}>
      
      {/* 1. CARTA BASE (Física) */}
      <div
        onClick={() => onClick && onClick(card)}
        style={{ clipPath: clipPathOuter }}
        className={cn(
          "absolute inset-0 p-[2px] cursor-pointer select-none transition-all duration-300",
          isSelected ? "shadow-[0_0_50px_rgba(34,211,238,0.8)] ring-2 ring-cyan-400 ring-offset-black" : `shadow-2xl shadow-black ${faction.wrapper}`,
          isSelected && "bg-gradient-to-br from-cyan-400 via-white to-blue-500" 
        )}
      >
        <div style={{ clipPath: clipPathInner }} className={cn("w-full h-full relative flex flex-col justify-between bg-gradient-to-br overflow-hidden", faction.inner)}>
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[length:200%_200%] animate-[pulse_4s_ease-in-out_infinite] pointer-events-none" />

          {/* Cabecera */}
          <div className="flex justify-between items-start px-2 pt-2 relative z-10">
            <div className="flex items-center justify-center w-12 h-12 bg-black border border-yellow-500/80 text-yellow-400 font-black z-10 shadow-[0_0_15px_rgba(234,179,8,0.4)]" style={{ clipPath: "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)" }}>
              <Zap className="absolute opacity-20 w-8 h-8" />
              <span className="relative z-10 text-xl">{card.cost}</span>
            </div>
            <div className="bg-black/90 px-3 py-1.5 text-[10px] font-black tracking-widest text-white/70 uppercase border border-white/10 rounded-sm">
              {card.type}
            </div>
          </div>

          {/* Arte y Fondo */}
          <div className="flex-grow flex flex-col items-center justify-center relative z-10 mt-2 px-3">
            <div className="w-full h-32 mb-2 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)] relative overflow-hidden group rounded-sm bg-black">
               {card.bgUrl && <img src={card.bgUrl} alt="bg" className="absolute inset-0 w-full h-full object-cover z-0" />}
               <div className="absolute inset-0 mix-blend-overlay bg-cyan-500/10 z-0" />
               {!isOnBoard && card.renderUrl && <img src={card.renderUrl} alt={card.name} className="absolute inset-0 w-full h-full object-contain p-1 z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] scale-110" />}
               <div className="absolute top-0 w-full h-0.5 bg-cyan-400/50 opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_infinite]" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase w-full text-center truncate drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">{card.name}</h2>
          </div>

          {/* Panel de Datos Original */}
          <div className="bg-black/80 border-t border-white/10 p-3 relative z-10 flex flex-col justify-between h-[105px]">
            <p className="text-[11px] text-zinc-300 font-mono leading-relaxed line-clamp-3">{card.description}</p>
            <div className="flex justify-between items-end mt-1">
              {!isExecution ? (
                <>
                  <div className="flex items-center space-x-2 text-red-500 font-black text-2xl"><Sword className="w-5 h-5" /><span>{card.attack ?? 0}</span></div>
                  <div className="flex items-center space-x-2 text-blue-500 font-black text-2xl"><Shield className="w-5 h-5" /><span>{card.defense ?? 0}</span></div>
                </>
              ) : (
                <div className="flex items-center w-full justify-center space-x-2 text-purple-400 font-black text-lg tracking-widest"><Cpu className="w-5 h-5" /><span>SCRIPT_EXEC</span></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOLOGRAMA 3D VIVO (Solo en Tablero) */}
      {isOnBoard && card.renderUrl && (
        <div className="absolute inset-0 z-50 pointer-events-none flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            className="absolute bottom-[-10px] flex flex-col items-center justify-end pointer-events-none"
            style={{ width: "200%", height: "450px", transformOrigin: "bottom center", transform: isDefense ? 'rotateZ(90deg)' : 'none' }}
            initial={{ rotateX: -55 }}
            animate={{ rotateX: -55, y: [0, -15, 0] }}
            transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
          >
            {/* AURA DE FUEGO AZUL */}
            <div className="absolute bottom-24 w-[70%] h-[50%] bg-cyan-400/50 blur-[50px] rounded-full animate-pulse z-0 mix-blend-screen" />
            <div className="absolute bottom-16 w-[50%] h-[40%] bg-blue-600/60 blur-[60px] rounded-full animate-[pulse_2s_ease-in-out_infinite] z-0 mix-blend-screen" />

            {/* PERSONAJE GIGANTE */}
            <img src={card.renderUrl} alt="render-3d" className="relative z-10 w-full h-[300px] object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]" />

            {/* HUD GIGANTE */}
            <div className="relative z-20 flex gap-4 mt-2 bg-black/95 p-3 rounded-2xl border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.5)] backdrop-blur-xl">
              <div className="flex items-center gap-2"><Zap className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,1)]" /><span className="font-black text-white text-2xl">{card.cost}</span></div>
              
              {!isExecution && (
                <>
                  <div className="w-px h-8 bg-white/20 mx-1" />
                  <div className="flex items-center gap-2"><Sword className="w-6 h-6 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" /><span className="font-black text-white text-2xl">{card.attack ?? 0}</span></div>
                  <div className="w-px h-8 bg-white/20 mx-1" />
                  <div className="flex items-center gap-2"><Shield className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,1)]" /><span className="font-black text-white text-2xl">{card.defense ?? 0}</span></div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}