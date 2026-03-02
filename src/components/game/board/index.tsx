// src/components/game/board/index.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, Clock, ChevronRight, Swords } from "lucide-react";
import { PlayerHUD } from "./PlayerHUD";
import { Battlefield } from "./Battlefield";
import { SidePanels } from "./SidePanels";
import { PlayerHand } from "./PlayerHand";
import { CardBack } from "../card/CardBack";
import { useBoard } from "./hooks/useBoard";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const PHASE_DESCRIPTIONS: Record<string, string> = {
  'DRAW': 'ROBANDO CARTA...',
  'MAIN_1': 'FASE DE PREPARACIÓN (Invoca o Coloca Entidades)',
  'BATTLE': 'FASE DE COMBATE (Selecciona atacante)',
  'MAIN_2': 'PREPARACIÓN SECUNDARIA',
  'END': 'FIN DEL TURNO'
};

// Componente Timer super limpio y sin re-renders en cascada
function TurnTimer({ onTimeUp }: { onTimeUp: () => void }) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) {
      const tid = setTimeout(onTimeUp, 0);
      return () => clearTimeout(tid);
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center px-3 py-1 rounded bg-black/50 border border-white/10 font-mono text-lg font-black tracking-widest transition-colors",
      timeLeft <= 10 ? "text-red-500 animate-pulse border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "text-cyan-400"
    )}>
      00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
    </div>
  );
}

export function Board() {
  const {
    gameState, selectedCard, playingCard, isHistoryOpen, activeAttackerId,
    setIsHistoryOpen, toggleCardSelection, clearSelection, executePlayAction, handleEntityClick, advancePhase
  } = useBoard();

  const player = gameState.playerA;
  const opponent = gameState.playerB;

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans cursor-crosshair" onClick={clearSelection}>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,1)] pointer-events-none" />

      <div className="absolute top-6 left-6 z-50 flex flex-col items-start pointer-events-auto w-80">
        <div className="w-full bg-zinc-950/90 border-2 border-cyan-500/50 backdrop-blur-xl px-6 py-3 rounded-t-2xl flex items-center justify-between shadow-[0_10px_40px_rgba(6,182,212,0.5)]">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan-400 w-6 h-6 animate-pulse" />
            <span className="font-black text-white tracking-widest text-xl uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              Turno {gameState.turn}
            </span>
          </div>
          {/* EL PATRÓN DE LA LLAVE MAGICA: Re-monta el componente entero en lugar de hacer setState en su interior */}
          <TurnTimer key={`${gameState.turn}-${gameState.phase}`} onTimeUp={advancePhase} />
        </div>

        <div className="w-full bg-cyan-950/90 border-x-2 border-b-2 border-cyan-800 px-4 py-3 rounded-b-2xl shadow-lg flex flex-col items-center gap-3">
          <span className="text-[10px] font-black text-cyan-100 tracking-[0.1em] text-center opacity-80 uppercase">
            {PHASE_DESCRIPTIONS[gameState.phase] || gameState.phase}
          </span>

          <div className="flex w-full gap-2 h-8 relative">
            <AnimatePresence>
              {gameState.phase === 'MAIN_1' && gameState.hasNormalSummonedThisTurn && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex gap-2"
                >
                  <button onClick={advancePhase} className="flex-1 flex items-center justify-center gap-1 bg-red-900 hover:bg-red-700 text-red-100 py-1 rounded uppercase font-black text-[10px] tracking-widest border border-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">
                    <Swords size={12} /> Ir a Combate
                  </button>
                  <button onClick={advancePhase} className="flex-1 flex items-center justify-center gap-1 bg-cyan-800 hover:bg-cyan-600 text-cyan-100 py-1 rounded uppercase font-black text-[10px] tracking-widest border border-cyan-500 transition-all">
                    Fin Turno <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {(!gameState.hasNormalSummonedThisTurn || gameState.phase !== 'MAIN_1') && (
              <button
                onClick={advancePhase}
                className="w-full flex items-center justify-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white py-1 rounded uppercase font-black text-[10px] tracking-widest transition-all"
              >
                {gameState.phase === 'END' ? 'Pasar Turno' : 'Saltar Fase'} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex justify-center items-start z-30 pointer-events-none opacity-90">
        {opponent.hand.map((_, i) => {
          const total = opponent.hand.length;
          const center = (total - 1) / 2;
          const offset = i - center;
          return (
            <motion.div
              key={`op-hand-${i}`}
              initial={{ y: -100, scale: 0.4 }} 
              animate={{ y: Math.abs(offset) * 8, rotate: offset * 5, scale: 0.4 }}
              className="origin-top relative -mx-4 shadow-2xl"
              style={{ zIndex: 10 - Math.abs(offset) }}
            >
              <CardBack className="shadow-[0_20px_50px_rgba(0,0,0,0.9)]" />
            </motion.div>
          );
        })}
      </div>

      <PlayerHUD isOpponent={true} player={opponent} />
      <PlayerHUD isOpponent={false} player={player} />

      <div onClick={(e) => e.stopPropagation()}>
        <Battlefield
          playerActiveEntities={player.activeEntities}
          playerActiveExecutions={player.activeExecutions}
          opponentActiveEntities={opponent.activeEntities}
          opponentActiveExecutions={opponent.activeExecutions}
          playerDeckCount={player.deck.length}
          opponentDeckCount={opponent.deck.length}
          playerTopGraveCard={player.graveyard[player.graveyard.length - 1] || null}
          opponentTopGraveCard={opponent.graveyard[opponent.graveyard.length - 1] || null}
          playerGraveyardCount={player.graveyard.length}     
          opponentGraveyardCount={opponent.graveyard.length} 
          activeAttackerId={activeAttackerId}
          selectedCard={selectedCard}
          onEntityClick={handleEntityClick}
        />
      </div>

      <PlayerHand hand={player.hand} playingCard={playingCard} hasSummoned={gameState.hasNormalSummonedThisTurn} onCardClick={toggleCardSelection} onPlayAction={executePlayAction} />

      <div onClick={(e) => e.stopPropagation()}>
        <SidePanels selectedCard={selectedCard} isHistoryOpen={isHistoryOpen} onCloseCard={clearSelection} onCloseHistory={() => setIsHistoryOpen(false)} />
      </div>

      {!isHistoryOpen && (
        <button onClick={(e) => { e.stopPropagation(); setIsHistoryOpen(true); }} className="absolute bottom-6 right-6 z-50 bg-zinc-950/90 border-2 border-red-500/50 text-red-500 p-4 rounded-full hover:bg-red-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all">
          <History size={24} />
        </button>
      )}
    </div>
  );
}