"use client";

import { History } from "lucide-react";
import { IPlayer } from "@/core/entities/IPlayer";
import { ICard } from "@/core/entities/ICard";
import { PlayerHUD } from "./PlayerHUD";
import { Battlefield } from "./Battlefield";
import { SidePanels } from "./SidePanels";
import { PlayerHand } from "./PlayerHand";
import { useBoard } from "./hooks/useBoard";

interface BoardProps {
  player: IPlayer; opponent: IPlayer;
  playerHand: ICard[]; playerActiveEntities: ICard[]; playerActiveExecutions: ICard[];
  opponentActiveEntities: ICard[]; opponentActiveExecutions: ICard[];
}

export function Board(props: BoardProps) {
  const { 
    selectedCard, playingCard, isHistoryOpen, setIsHistoryOpen, 
    toggleCardSelection, clearSelection, executePlayAction, setSelectedCard, setPlayingCard 
  } = useBoard();

  return (
    <div className="relative w-full h-screen bg-[#020305] overflow-hidden font-sans cursor-crosshair" onClick={clearSelection}>
      
      {/* Fondo Abisal Limpio */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,1)] pointer-events-none" />

      <PlayerHUD isOpponent={true} player={props.opponent} />
      <PlayerHUD isOpponent={false} player={props.player} />

      <div onClick={(e) => e.stopPropagation()}>
        <Battlefield 
          {...props} 
          onCardClick={(card) => { setSelectedCard(card); setPlayingCard(null); }} 
        />
      </div>

      <PlayerHand 
        hand={props.playerHand} 
        playingCard={playingCard} 
        onCardClick={toggleCardSelection} 
        onPlayAction={executePlayAction} 
      />

      <div onClick={(e) => e.stopPropagation()}>
        <SidePanels selectedCard={selectedCard} isHistoryOpen={isHistoryOpen} onCloseCard={clearSelection} onCloseHistory={() => setIsHistoryOpen(false)} />
      </div>

      {!isHistoryOpen && (
        <button onClick={(e) => { e.stopPropagation(); setIsHistoryOpen(true); }} className="absolute bottom-6 right-6 z-40 bg-zinc-950/90 border-2 border-red-500/50 text-red-500 p-4 rounded-full hover:bg-red-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all">
          <History size={24} />
        </button>
      )}
    </div>
  );
}