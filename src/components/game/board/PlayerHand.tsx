// src/components/game/board/PlayerHand.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ICard } from "@/core/entities/ICard";
import { BattleMode } from "@/core/entities/IPlayer";
import { Card } from "@/components/game/card/Card";

const AttackIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="2" width="12" height="20" rx="2"/></svg>;
const DefenseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/></svg>;
const SetIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="4 4"/></svg>;

interface PlayerHandProps {
  hand: ICard[]; 
  playingCard: ICard | null; 
  hasSummoned: boolean;
  onCardClick: (card: ICard, e: React.MouseEvent) => void;
  onPlayAction: (mode: BattleMode, e: React.MouseEvent) => void;
}

export function PlayerHand({ hand, playingCard, hasSummoned, onCardClick, onPlayAction }: PlayerHandProps) {
  return (
    // LA SOLUCIÓN: Subimos la altura del contenedor a h-[500px] para que las cartas no se corten por arriba
    <div className="absolute bottom-0 left-0 w-full h-[500px] flex justify-center items-end z-40 pointer-events-none perspective-[1200px] pb-4">
      <div className="flex justify-center -space-x-12 pointer-events-auto">
        {hand.map((card, i) => (
          <div key={card.id} className="relative">
            
            <AnimatePresence>
              {playingCard?.id === card.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: -20, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 z-[100] flex gap-2 bg-zinc-950/90 p-2 rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)] backdrop-blur-md whitespace-nowrap"
                >
                  {hasSummoned ? (
                    <span className="text-red-400 font-mono text-xs px-4 py-2 uppercase tracking-widest font-bold bg-red-950/40 rounded border border-red-500/20">Límite Alcanzado</span>
                  ) : (
                    <>
                      <button onClick={(e) => onPlayAction('ATTACK', e)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-500/50 text-red-400 text-xs font-black rounded-lg transition-all"><AttackIcon /> ATK</button>
                      <button onClick={(e) => onPlayAction('DEFENSE', e)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-500/50 text-blue-400 text-xs font-black rounded-lg transition-all"><DefenseIcon /> DEF</button>
                      <button onClick={(e) => onPlayAction('SET', e)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900 border border-purple-500/50 text-purple-400 text-xs font-black rounded-lg transition-all"><SetIcon /> SET</button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              layoutId={`card-animation-${card.id}`}
              // Reducimos el tamaño global a 0.8 para que sean manejables en pantalla
              initial={{ y: 200, scale: 0.8 }} 
              animate={{ y: playingCard?.id === card.id ? -20 : 60, rotate: playingCard?.id === card.id ? 0 : 0, scale: 0.8 }}
              whileHover={{ y: playingCard?.id === card.id ? -20 : -40, x: playingCard?.id === card.id ? 0 : -10, rotate: playingCard?.id === card.id ? 0 : -4, scale: 0.9, zIndex: 100 }}
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