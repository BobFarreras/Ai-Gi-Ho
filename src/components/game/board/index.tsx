"use client";

import { motion } from "framer-motion";
import { History, Clock, ChevronRight } from "lucide-react";
import { PlayerHUD } from "./PlayerHUD";
import { Battlefield } from "./Battlefield";
import { SidePanels } from "./SidePanels";
import { PlayerHand } from "./PlayerHand";
import { CardBack } from "../card/CardBack";
import { useBoard } from "./hooks/useBoard";

export function Board() {
  const {
    gameState, selectedCard, playingCard, isHistoryOpen, activeAttackerId,
    setIsHistoryOpen, toggleCardSelection, clearSelection, executePlayAction, handleEntityClick, advancePhase
  } = useBoard();

  const player = gameState.playerA;
  const opponent = gameState.playerB;

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans cursor-crosshair" onClick={clearSelection}>

      {/* Fondo Base */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,1)] pointer-events-none" />

      {/* INDICADOR DE TURNO Y FASE INTERACTIVO */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 z-50 flex flex-col items-start pointer-events-auto">

        <div className="bg-zinc-950/90 border-2 border-cyan-500/50 backdrop-blur-xl px-6 py-4 rounded-t-2xl flex items-center gap-3 shadow-[0_10px_40px_rgba(6,182,212,0.5)]">
          <Clock className="text-cyan-400 w-6 h-6 animate-pulse" />
          <span className="font-black text-white tracking-widest text-xl uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            Turno {gameState.turn}
          </span>
        </div>

        <div className="w-full bg-cyan-950/90 border-x-2 border-b-2 border-cyan-800 px-4 py-2 rounded-b-2xl text-[12px] font-black font-mono text-cyan-300 tracking-[0.2em] shadow-lg flex flex-col items-center gap-2">
          <span>{gameState.phase}</span>

          {/* BOTÓN DE SIGUIENTE FASE */}
          <button
            onClick={advancePhase}
            className="w-full flex items-center justify-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-black py-1.5 rounded uppercase font-black tracking-widest transition-all"
          >
            {gameState.phase === 'END' ? 'Paso de Turno' : 'Next Phase'} <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* MANO DEL OPONENTE */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 flex justify-center items-start z-30 pointer-events-none">
        {opponent.hand.map((_, i) => {
          const total = opponent.hand.length;
          const center = (total - 1) / 2;
          const offset = i - center;
          const rotation = offset * 8;
          const yPos = Math.abs(offset) * 10;

          return (
            <motion.div
              key={`op-hand-${i}`}
              initial={{ y: -100 }} animate={{ y: yPos, rotate: rotation }}
              className="origin-top relative -mx-8 shadow-2xl"
              style={{ zIndex: 10 - Math.abs(offset) }}
            >
              <CardBack className="scale-[0.55]" />
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
          activeAttackerId={activeAttackerId}
          onEntityClick={handleEntityClick}
        />
      </div>

      <PlayerHand
        hand={player.hand}
        playingCard={playingCard}
        hasSummoned={gameState.hasNormalSummonedThisTurn}
        onCardClick={toggleCardSelection}
        onPlayAction={executePlayAction}
      />

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