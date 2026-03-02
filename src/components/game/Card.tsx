"use client"; // Necesario para Framer Motion y eventos onClick en App Router

import { motion } from "framer-motion";
import { Shield, Sword, Zap } from "lucide-react";
import { ICard, Faction } from "@/core/entities/ICard";
import { cn } from "@/lib/utils";

/**
 * Mapeo de colores y gradientes espectaculares basados en la facción.
 */
const FACTION_STYLES: Record<Faction, string> = {
  OPEN_SOURCE: "from-emerald-500/20 to-emerald-900/80 border-emerald-500/50 shadow-emerald-500/20",
  BIG_TECH: "from-blue-500/20 to-blue-900/80 border-blue-500/50 shadow-blue-500/20",
  NO_CODE: "from-purple-500/20 to-purple-900/80 border-purple-500/50 shadow-purple-500/20",
  NEUTRAL: "from-zinc-500/20 to-zinc-900/80 border-zinc-500/50 shadow-zinc-500/20",
};

interface CardProps {
  card: ICard;
  onClick?: (card: ICard) => void;
  isSelected?: boolean;
}

/**
 * Componente visual de una Carta del juego.
 * Implementa animaciones con Framer Motion y diseño responsivo.
 */
export function Card({ card, onClick, isSelected = false }: CardProps) {
  const factionStyle = FACTION_STYLES[card.faction] || FACTION_STYLES.NEUTRAL;

  return (
    <motion.div
      onClick={() => onClick && onClick(card)}
      // Animaciones de Framer Motion
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // Estilos base de la carta
      className={cn(
        "relative w-64 h-80 rounded-2xl p-4 cursor-pointer select-none",
        "bg-gradient-to-br backdrop-blur-md border",
        "flex flex-col justify-between overflow-hidden transition-shadow duration-300",
        isSelected ? "ring-4 ring-white shadow-2xl" : "hover:shadow-xl",
        factionStyle
      )}
    >
      {/* Coste de Energía (Arriba a la izquierda) */}
      <div className="absolute top-3 left-3 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-yellow-400/50 text-yellow-400 font-bold z-10 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
        <Zap className="absolute opacity-30 w-8 h-8" />
        <span className="relative z-10 text-lg">{card.cost}</span>
      </div>

      {/* Tipo de Carta (Arriba a la derecha) */}
      <div className="absolute top-4 right-4 text-xs font-bold tracking-wider text-white/60 uppercase">
        {card.type}
      </div>

      {/* Título y Arte (Simulado) */}
      <div className="mt-8 text-center flex-grow flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-4 rounded-xl bg-gradient-to-tr from-white/5 to-white/20 border border-white/10 flex items-center justify-center shadow-inner">
           {/* Aquí irá la imagen de Supabase en el futuro */}
           <span className="text-white/30 text-xs">NO IMAGE</span>
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
          {card.name}
        </h2>
      </div>

      {/* Descripción */}
      <div className="bg-black/40 rounded-lg p-3 mt-2 border border-white/10 h-20 overflow-y-auto">
        <p className="text-sm text-zinc-300 italic leading-snug">
          {card.description}
        </p>
      </div>

      {/* Stats: Ataque y Defensa (Abajo) */}
      <div className="flex justify-between mt-3 px-1">
        <div className="flex items-center space-x-1 text-red-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
          <Sword className="w-5 h-5" />
          <span>{card.attack ?? 0}</span>
        </div>
        <div className="flex items-center space-x-1 text-blue-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
          <Shield className="w-5 h-5" />
          <span>{card.defense ?? 0}</span>
        </div>
      </div>
    </motion.div>
  );
}