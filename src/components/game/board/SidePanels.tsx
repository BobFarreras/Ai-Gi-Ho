// src/components/game/Board/SidePanels.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, X } from "lucide-react";
import { ICard } from "@/core/entities/ICard";
import { Card } from "../Card";

interface SidePanelsProps {
  selectedCard: ICard | null;
  isHistoryOpen: boolean;
  onCloseCard: () => void;
  onCloseHistory: () => void;
}

export function SidePanels({ selectedCard, isHistoryOpen, onCloseCard, onCloseHistory }: SidePanelsProps) {
  return (
    <AnimatePresence>
      {/* PANEL IZQUIERDO: Detalles de Carta */}
      {selectedCard && (
        <motion.div 
          initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25 }}
          className="absolute top-0 left-0 w-80 h-full bg-zinc-950/90 border-r border-cyan-500/30 z-50 p-6 backdrop-blur-xl flex flex-col shadow-2xl"
        >
          <button onClick={onCloseCard} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Cerrar detalle">
            <X size={24} />
          </button>
          <div className="mt-8 scale-110 transform origin-top mb-8">
            <Card card={selectedCard} />
          </div>
          <div className="text-white overflow-y-auto pr-2">
            <h2 className="text-2xl font-black mb-1">{selectedCard.name}</h2>
            <span className="text-cyan-400 text-xs tracking-widest uppercase font-bold mb-4 block">
              [{selectedCard.faction} - {selectedCard.type}]
            </span>
            <p className="text-zinc-300 text-sm leading-relaxed">{selectedCard.description}</p>
          </div>
        </motion.div>
      )}

      {/* PANEL DERECHO: Historial de Acciones */}
      {isHistoryOpen && (
        <motion.div 
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }}
          className="absolute top-0 right-0 w-80 h-full bg-zinc-950/90 border-l border-red-500/30 z-50 p-6 backdrop-blur-xl flex flex-col shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2"><History size={20}/> Log de Batalla</h2>
            <button onClick={onCloseHistory} className="text-zinc-400 hover:text-white" aria-label="Cerrar historial"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto text-sm text-zinc-400 space-y-4">
            <p><span className="text-cyan-400 font-bold">Sistema:</span> Combate iniciado.</p>
            {/* Aquí irá el log real */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}