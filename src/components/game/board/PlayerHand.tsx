"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ICard } from "@/core/entities/ICard";
import { Card } from "../Card";

// Íconos simplificados
const AttackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="2" width="12" height="20" rx="2"/></svg>;
const DefenseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/></svg>;

interface PlayerHandProps {
  hand: ICard[];
  playingCard: ICard | null;
  onCardClick: (card: ICard, e: React.MouseEvent) => void;
  onPlayAction: (mode: 'ATTACK' | 'DEFENSE', e: React.MouseEvent) => void;
}

export function PlayerHand({ hand, playingCard, onCardClick, onPlayAction }: PlayerHandProps) {
  return (
    <div className="absolute bottom-[-20px] left-0 w-full h-64 flex justify-center items-end z-40 pointer-events-none perspective-[1200px]">
      <div className="flex justify-center -space-x-8 pointer-events-auto">
        {hand.map((card, i) => (
          <div key={card.id} className="relative">
            {/* Menú de Acción */}
            <AnimatePresence>
              {playingCard?.id === card.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: -20, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 z-[100] flex gap-2 bg-zinc-950/90 p-2 rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)] backdrop-blur-md"
                >
                  <button onClick={(e) => onPlayAction('ATTACK', e)} className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900 border border-red-500/50 text-red-400 font-bold rounded-lg transition-all">
                    <AttackIcon /> ATK
                  </button>
                  <button onClick={(e) => onPlayAction('DEFENSE', e)} className="flex items-center gap-2 px-4 py-2 bg-blue-950/40 hover:bg-blue-900 border border-blue-500/50 text-blue-400 font-bold rounded-lg transition-all">
                    <DefenseIcon /> DEF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Carta */}
            <motion.div 
              initial={{ y: 200 }} 
              animate={{ y: playingCard?.id === card.id ? -50 : 80, rotate: playingCard?.id === card.id ? 0 : 0 }}
              whileHover={{ y: playingCard?.id === card.id ? -50 : -60, x: playingCard?.id === card.id ? 0 : -15, rotate: playingCard?.id === card.id ? 0 : -6, scale: 1.1, zIndex: 100 }}
              onClick={(e) => onCardClick(card, e)}
              className="transition-transform duration-75 cursor-pointer origin-bottom-right"
              style={{ zIndex: playingCard?.id === card.id ? 100 : i }}
            >
              <Card card={card} isSelected={playingCard?.id === card.id} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}