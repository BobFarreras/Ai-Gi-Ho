"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ICard } from "@/core/entities/ICard";
import { IBoardEntity } from "@/core/entities/IPlayer";

import { cn } from "@/lib/utils";
import { CardBack } from "../card/CardBack";
import { Card } from "../card/Card";

interface BattlefieldProps {
    playerActiveEntities: IBoardEntity[];
    playerActiveExecutions: IBoardEntity[];
    opponentActiveEntities: IBoardEntity[];
    opponentActiveExecutions: IBoardEntity[];
    playerDeckCount: number;   
    opponentDeckCount: number; 
    activeAttackerId: string | null;
    onEntityClick: (entity: IBoardEntity, isOpponent: boolean, e: React.MouseEvent) => void;
}

export function Battlefield({
    playerActiveEntities, playerActiveExecutions,
    opponentActiveEntities, opponentActiveExecutions,
    playerDeckCount, opponentDeckCount,
    activeAttackerId, onEntityClick
}: BattlefieldProps) {
    const [zoom, setZoom] = useState(1);

    const handleWheel = (e: React.WheelEvent) => {
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.6), 1.6));
    };

    // Añadimos isOpponentSide para saber a quién estamos clickeando
    const renderSlots = (entities: IBoardEntity[], total: number, isOpponentSide: boolean) => {
        return Array.from({ length: total }).map((_, i) => {
            const entity = entities[i];
            const isDefense = entity?.mode === 'DEFENSE';
            const isSet = entity?.mode === 'SET';
            const isAttacking = entity?.instanceId === activeAttackerId;

            return (
                <div key={i} className="relative w-24 h-36 border-2 border-cyan-500/30 rounded-lg bg-cyan-950/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)_inset] overflow-hidden group hover:border-cyan-300 hover:bg-cyan-900/40 transition-all duration-300">
                    {entity ? (
                        <motion.div
                            layoutId={`card-animation-${entity.card.id}`}
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.35] origin-center cursor-pointer transition-all duration-300 z-10",
                                (isDefense || isSet) ? "-rotate-90" : "",
                                // Si es el atacante, brilla en ROJO con un pulso
                                isAttacking ? "scale-[0.38] ring-8 ring-red-500 shadow-[0_0_40px_rgba(239,68,68,1)] animate-pulse" : "group-hover:scale-[0.40]"
                            )}
                            onClick={(e) => onEntityClick(entity, isOpponentSide, e)}
                        >
                            {isSet ? <CardBack isHorizontal={true} /> : <Card card={entity.card} />}
                        </motion.div>
                    ) : (
                        <span className="text-cyan-500/30 text-[10px] font-black font-mono tracking-widest opacity-50 group-hover:opacity-100">SLOT_{i + 1}</span>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-auto" onWheel={handleWheel}>
            <motion.div
                drag dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }} dragElastic={0.05}
                animate={{ scale: zoom }} transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1200px]"
            >
                {/* Si estamos apuntando, el tablero entero se tiñe sutilmente de rojo */}
                <div className={cn(
                    "w-[1050px] h-[800px] transform rotate-x-[55deg] relative flex flex-col justify-center items-center gap-6 rounded-[3rem] border-[4px] border-cyan-900/80 bg-zinc-950/90 shadow-[0_0_100px_rgba(6,182,212,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden transition-colors duration-500",
                    activeAttackerId ? "border-red-900/80 shadow-[0_0_100px_rgba(239,68,68,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)]" : ""
                )}>
                    
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

                    {/* --- ZONA DEL OPONENTE --- */}
                    <div className={cn(
                        "flex w-full justify-center items-center gap-8 mb-4 z-10 p-4 rounded-2xl transition-colors duration-300",
                        activeAttackerId ? "bg-red-950/30 cursor-crosshair" : "" // Cursor de mira si apuntamos
                    )}>
                        <div className="w-24 h-36 border-2 border-dashed border-red-500/40 bg-red-950/20 rounded-lg flex flex-col items-center justify-center text-red-500/60 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                            <span className="font-black text-xs uppercase tracking-widest">Grave</span><span className="text-xs mt-1 opacity-50 font-mono">0</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 opacity-60">{renderSlots(opponentActiveExecutions, 3, true)}</div>
                            <div className="flex gap-3">{renderSlots(opponentActiveEntities, 3, true)}</div>
                        </div>
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center overflow-hidden bg-black/50">
                            <div className="absolute inset-0 scale-[0.35] origin-center opacity-80"><CardBack /></div>
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]">{opponentDeckCount}</span>
                        </div>
                    </div>

                    <div className="w-[85%] h-1.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] opacity-70 z-10 rounded-full" />

                    {/* --- ZONA DEL JUGADOR --- */}
                    <div className="flex w-full justify-center items-center gap-8 mt-4 z-10 p-4">
                        <div className="w-24 h-36 border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 rounded-lg flex flex-col items-center justify-center text-cyan-500/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                            <span className="font-black text-xs uppercase tracking-widest">Grave</span><span className="text-xs mt-1 opacity-50 font-mono">0</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">{renderSlots(playerActiveEntities, 3, false)}</div>
                            <div className="flex gap-3 opacity-60">{renderSlots(playerActiveExecutions, 3, false)}</div>
                        </div>
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center overflow-hidden bg-black/50">
                            <div className="absolute inset-0 scale-[0.35] origin-center opacity-80"><CardBack /></div>
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]">{playerDeckCount}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}