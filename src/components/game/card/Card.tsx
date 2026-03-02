// src/components/game/card/Card.tsx
"use client";

import { Shield, Sword, Zap } from "lucide-react";
import { ICard, Faction } from "@/core/entities/ICard";
import { cn } from "@/lib/utils";

// Definimos el color del "borde exterior" y el "núcleo interior"
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
}

export function Card({ card, onClick, isSelected = false }: CardProps) {
  const faction = FACTION_STYLES[card.faction] || FACTION_STYLES.NEUTRAL;

  const clipPathOuter = "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";
  const clipPathInner = "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)";

  return (
    <div
      onClick={() => onClick && onClick(card)}
      style={{ clipPath: clipPathOuter }}
      className={cn(
        "relative w-[260px] h-[340px] p-[2px] cursor-pointer select-none",
        "transition-all duration-300 backdrop-blur-3xl",
        // Si está seleccionada, le damos un brillo cian intenso a los bordes
        isSelected ? "shadow-[0_0_50px_rgba(34,211,238,0.8)] ring-2 ring-cyan-400 ring-offset-black" : `shadow-2xl shadow-black ${faction.wrapper}`,
        isSelected && "bg-gradient-to-br from-cyan-400 via-white to-blue-500" 
      )}
    >
      {/* NÚCLEO INTERNO */}
      <div 
        style={{ clipPath: clipPathInner }}
        className={cn("w-full h-full relative flex flex-col justify-between bg-gradient-to-br overflow-hidden", faction.inner)}
      >
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

        {/* Arte */}
        <div className="flex-grow flex flex-col items-center justify-center relative z-10 mt-2 px-3">
          <div className="w-full h-32 mb-2 bg-black/80 border border-white/10 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1)] relative overflow-hidden group rounded-sm">
             <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay" />
             <div className="absolute top-0 w-full h-0.5 bg-cyan-400/50 opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_infinite]" />
             <span className="text-white/30 text-xs font-mono tracking-widest">DATA_CORE</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase w-full text-center truncate drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
            {card.name}
          </h2>
        </div>

        {/* Panel de Datos y Stats */}
        <div className="bg-black/80 border-t border-white/10 p-3 relative z-10 flex flex-col justify-between h-[105px]">
          <p className="text-[11px] text-zinc-300 font-mono leading-relaxed line-clamp-3">
            {card.description}
          </p>
          
          <div className="flex justify-between items-end mt-1">
            <div className="flex items-center space-x-2 text-red-500 font-black text-2xl drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              <Sword className="w-5 h-5" />
              <span>{card.attack ?? 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-500 font-black text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
              <Shield className="w-5 h-5" />
              <span>{card.defense ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}