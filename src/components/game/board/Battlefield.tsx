"use client";

import { motion } from "framer-motion";
import { ICard } from "@/core/entities/ICard";
import { Card } from "../Card";

interface BattlefieldProps {
    playerActiveEntities: ICard[];
    playerActiveExecutions: ICard[];
    opponentActiveEntities: ICard[];
    opponentActiveExecutions: ICard[];
    onCardClick: (card: ICard) => void;
}

export function Battlefield({
    playerActiveEntities, playerActiveExecutions,
    opponentActiveEntities, opponentActiveExecutions,
    onCardClick
}: BattlefieldProps) {

    const renderSlots = (cards: ICard[], total: number) => {
        return Array.from({ length: total }).map((_, i) => {
            const card = cards[i];
            return (
                // El Slot: Tamaño exacto para el tablero
                <div key={i} className="relative w-24 h-36 border-2 border-cyan-500/20 rounded-md bg-black/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)_inset] overflow-hidden group">
                    {card ? (
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.35] w-64 h-80 origin-center cursor-pointer transition-transform duration-300 group-hover:scale-[0.40] z-10"
                            onClick={() => onCardClick(card)}
                        >
                            <Card card={card} />
                        </div>
                    ) : (
                        <span className="text-cyan-500/20 text-xs font-bold font-mono">SLOT {i + 1}</span>
                    )}
                </div>
            );
        });
    };

    return (
        <motion.div
            drag dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }} dragElastic={0.1}
            // SOLUCIÓN AL SOLAPAMIENTO: pb-24 y -translate-y-12 suben el tablero para dejar espacio a la mano
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1200px] pb-24 -translate-y-12"
        >
            {/* ILUMINADO Y MÁS VISIBLE: bg-zinc-800/80 en vez de bg-zinc-950/80 */}
            <div className="w-[900px] h-[700px] transform rotate-x-[50deg] scale-110 relative flex flex-col justify-center items-center gap-4 rounded-[3rem] border border-cyan-400/40 bg-zinc-800/80 p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden backdrop-blur-sm">

                {/* REJILLA MÁS BRILLANTE: opacity-30 */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-30 animate-[pulse_4s_ease-in-out_infinite]" />

                {/* --- LADO DEL OPONENTE --- */}
                <div className="flex w-full justify-between items-center mb-2 z-10">
                    <div className="w-24 h-36 border-2 border-dashed border-red-500/30 bg-red-950/20 flex flex-col items-center justify-center text-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)_inset]">
                        <span className="font-bold text-xs uppercase tracking-widest">Grave</span>
                        <span className="text-[10px] mt-1 opacity-50">0</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 opacity-70">{renderSlots(opponentActiveExecutions, 3)}</div>
                        <div className="flex gap-4">{renderSlots(opponentActiveEntities, 3)}</div>
                    </div>
                    <div className="w-24 h-36 bg-zinc-900 border-2 border-zinc-700 shadow-[5px_5px_0_rgba(0,0,0,0.8)] flex items-center justify-center text-zinc-600 font-bold tracking-widest">DECK</div>
                </div>

                {/* LÍNEA DIVISORIA DE ENERGÍA */}
                <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] my-4 z-10" />

                {/* --- LADO DEL JUGADOR --- */}
                <div className="flex w-full justify-between items-center mt-2 z-10">
                    <div className="w-24 h-36 border-2 border-dashed border-cyan-500/30 bg-cyan-950/20 flex flex-col items-center justify-center text-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)_inset]">
                        <span className="font-bold text-xs uppercase tracking-widest">Grave</span>
                        <span className="text-[10px] mt-1 opacity-50">0</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4">{renderSlots(playerActiveEntities, 3)}</div>
                        <div className="flex gap-4 opacity-70">{renderSlots(playerActiveExecutions, 3)}</div>
                    </div>
                    <div className="w-24 h-36 bg-zinc-900 border-2 border-zinc-700 shadow-[5px_5px_0_rgba(0,0,0,0.8)] flex items-center justify-center text-zinc-600 font-bold tracking-widest">DECK</div>
                </div>

            </div>
        </motion.div>
    );
}