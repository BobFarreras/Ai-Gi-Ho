"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Shield, Sword } from "lucide-react";
import { IPlayer } from "@/core/entities/IPlayer";
import { ICard } from "@/core/entities/ICard";
import { PlayerHUD } from "./PlayerHUD";
import { Battlefield } from "./Battlefield";
import { SidePanels } from "./SidePanels";
import { Card } from "../Card";

interface BoardProps {
  player: IPlayer;
  opponent: IPlayer;
  playerHand: ICard[];
  playerActiveEntities: ICard[];
  playerActiveExecutions: ICard[];
  opponentActiveEntities: ICard[];
  opponentActiveExecutions: ICard[];
}

export function Board({
  player, opponent, playerHand,
  playerActiveEntities, playerActiveExecutions,
  opponentActiveEntities, opponentActiveExecutions
}: BoardProps) {
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [playingCard, setPlayingCard] = useState<ICard | null>(null); // Carta seleccionada para jugar
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleHandCardClick = (card: ICard) => {
    setSelectedCard(card); // Abre los detalles a la izquierda
    setPlayingCard(card);  // Activa el menú de jugar (Ataque/Defensa)
  };

  const handlePlayAction = (mode: 'ATTACK' | 'DEFENSE') => {
    console.log(`Jugando ${playingCard?.name} en modo ${mode}`);
    // Aquí irá la lógica de Supabase/Dominio en el futuro
    setPlayingCard(null);
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden font-sans">
      {/* Fondo base oscuro sideral */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black opacity-80" />

      <PlayerHUD isOpponent={true} player={opponent} />
      <PlayerHUD isOpponent={false} player={player} />

      <Battlefield 
        playerActiveEntities={playerActiveEntities}
        playerActiveExecutions={playerActiveExecutions}
        opponentActiveEntities={opponentActiveEntities}
        opponentActiveExecutions={opponentActiveExecutions}
        onCardClick={(card) => { setSelectedCard(card); setPlayingCard(null); }}
      />

      {/* LA MANO DEL JUGADOR (Escondida y Faneada) */}
      <div className="absolute bottom-0 left-0 w-full h-56 flex justify-center items-end pb-0 z-30 pointer-events-none perspective-[1000px]">
        <div className="flex justify-center -space-x-12 pointer-events-auto">
          {playerHand.map((card, i) => (
            <motion.div 
              key={card.id} 
              initial={{ y: 200 }} 
              animate={{ y: playingCard?.id === card.id ? -40 : 120 }} // Escondida (120px abajo)
              whileHover={{ y: playingCard?.id === card.id ? -40 : -20, scale: 1.05, zIndex: 50 }} // Sube al pasar el ratón
              onClick={() => handleHandCardClick(card)}
              className="transition-transform duration-200 cursor-pointer drop-shadow-[0_-5px_15px_rgba(0,0,0,0.8)]"
              style={{ zIndex: playingCard?.id === card.id ? 60 : i }}
            >
              <Card card={card} isSelected={playingCard?.id === card.id} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* MENÚ FLOTANTE: ATACAR / DEFENDER */}
      <AnimatePresence>
        {playingCard && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-64 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-zinc-950/90 p-4 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <button 
              onClick={() => handlePlayAction('ATTACK')}
              className="flex items-center gap-2 px-6 py-3 bg-red-950/50 hover:bg-red-600 border border-red-500/50 text-red-100 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] uppercase tracking-wider"
            >
              <Sword size={20} /> Modo Ataque
            </button>
            <button 
              onClick={() => handlePlayAction('DEFENSE')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-950/50 hover:bg-blue-600 border border-blue-500/50 text-blue-100 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] uppercase tracking-wider"
            >
              <Shield size={20} /> Modo Defensa
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SidePanels 
        selectedCard={selectedCard} isHistoryOpen={isHistoryOpen}
        onCloseCard={() => { setSelectedCard(null); setPlayingCard(null); }}
        onCloseHistory={() => setIsHistoryOpen(false)}
      />

      {!isHistoryOpen && (
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="absolute top-4 left-4 z-40 bg-zinc-900/80 border border-zinc-700 text-white p-3 rounded-full hover:bg-zinc-800 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md"
        >
          <History size={24} />
        </button>
      )}
    </div>
  );
}