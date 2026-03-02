// src/components/game/board/SidePanels.tsx
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
            {/* PANEL IZQUIERDO */}
            {selectedCard && (
                <motion.div
                    key="left-panel"
                    initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    // Modificado: top-6 y bottom-[120px] (Para no pisar el HUD que ahora está en bottom-6)
                    className="absolute top-6 left-6 w-80 bottom-[120px] bg-zinc-950/80 border-r-2 border-cyan-500/50 z-50 p-6 backdrop-blur-2xl shadow-[20px_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-r-3xl"
                >
                    <button onClick={onCloseCard} className="absolute top-4 right-4 text-cyan-500 hover:text-white z-20">
                        <X size={24} />
                    </button>
                    <div className="relative mt-2 flex justify-center z-10 scale-90 origin-top">
                        <Card card={selectedCard} />
                    </div>
                    <div className="text-white overflow-y-auto pr-2 z-10 mt-2 custom-scrollbar flex-1">
                        <h2 className="text-2xl font-black text-cyan-300 uppercase tracking-tight">{selectedCard.name}</h2>
                        <span className="text-zinc-500 text-xs tracking-widest uppercase font-bold mb-4 block border-b border-zinc-800 pb-2">
                            {selectedCard.faction}  {selectedCard.type}
                        </span>
                        <p className="text-zinc-300 text-sm leading-relaxed">{selectedCard.description}</p>
                    </div>
                </motion.div>
            )}

            {/* PANEL DERECHO: Historial (Respeta el HUD del oponente en top-4) */}
            {isHistoryOpen && (
                <motion.div
                    key="right-panel"
                    initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    // Empieza por debajo del HUD del Oponente y baja hasta el fondo
                    className="absolute top-[120px] right-4 w-80 bottom-24 bg-zinc-950/80 border-l-2 border-red-500/50 z-50 p-6 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-l-3xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-red-900 pb-4">
                        <h2 className="text-xl font-black text-red-500 tracking-widest uppercase">Combat Log</h2>
                        <button onClick={onCloseHistory} className="text-red-500 hover:text-white"><X size={24} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto text-xs space-y-4 font-mono text-zinc-400">
                        <p><span className="text-red-500 font-bold">[SYS]</span> Escaneo de campo completado.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}