// src/components/game/board/Battlefield.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IBoardEntity } from "@/core/entities/IPlayer";
import { ICard } from "@/core/entities/ICard";
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
    playerTopGraveCard: ICard | null;     
    opponentTopGraveCard: ICard | null;   
    playerGraveyardCount: number;     
    opponentGraveyardCount: number;   
    activeAttackerId: string | null;
    selectedCard: ICard | null;
    onEntityClick: (entity: IBoardEntity | null, isOpponentSide: boolean, e: React.MouseEvent) => void;
}

export function Battlefield({
    playerActiveEntities, playerActiveExecutions,
    opponentActiveEntities, opponentActiveExecutions,
    playerDeckCount, opponentDeckCount,
    playerTopGraveCard, opponentTopGraveCard,
    playerGraveyardCount, opponentGraveyardCount,
    activeAttackerId, selectedCard,
    onEntityClick
}: BattlefieldProps) {
    const [zoom, setZoom] = useState(1);

    const handleWheel = (e: React.WheelEvent) => {
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.6), 1.6));
    };

    const renderSlots = (entities: IBoardEntity[], total: number, isOpponentSide: boolean) => {
        return Array.from({ length: total }).map((_, i) => {
            const entity = entities[i];
            const isDefense = entity?.mode === 'DEFENSE';
            const isSet = entity?.mode === 'SET';
            const isAttacking = entity?.instanceId === activeAttackerId;
            const targetX = -120 - (i * 105);

            return (
                <div key={i} className="relative w-24 h-36 border-2 border-cyan-500/30 rounded-lg bg-cyan-950/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)_inset] group hover:border-cyan-300 transition-colors duration-300">
                    <AnimatePresence>
                        {entity ? (
                            <motion.div
                                key={entity.instanceId} 
                                // ¡SOLUCIÓN MAGISTRAL! Eliminamos layoutId de aquí. Así evitamos el Glitch de Framer Motion.
                                initial={{ opacity: 0, scale: 0.2, y: -50 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: isAttacking ? 0.38 : 0.28, 
                                    y: isAttacking ? (isOpponentSide ? 30 : -30) : 0, 
                                    zIndex: isAttacking ? 50 : 10 
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                exit={{ 
                                    opacity: [1, 1, 1, 0], 
                                    scale: [0.28, 0.35, 0.35, 0.20], 
                                    x: [0, -10, 10, -10, 10, targetX], 
                                    y: [0, 0, 0, 0, 0, 0],
                                    rotate: [0, -5, 5, -5, 5, -5],
                                    filter: [
                                        "brightness(1)", 
                                        "brightness(1.5) drop-shadow(0 0 30px red)", 
                                        "brightness(1.5) drop-shadow(0 0 30px red)", 
                                        "brightness(0.5) grayscale(0.8)"
                                    ],
                                    transition: { duration: 1.0, times: [0, 0.1, 0.2, 0.3, 0.6, 1] }
                                }}
                                className={cn(
                                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center cursor-pointer",
                                    (isDefense || isSet) ? "-rotate-90" : "",
                                    isAttacking ? "ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,1)] animate-pulse" : ""
                                )}
                                onClick={(e) => onEntityClick(entity, isOpponentSide, e)}
                            >
                                {isSet ? <CardBack isHorizontal={true} /> : <Card card={entity.card} isSelected={selectedCard?.id === entity.card.id} />}
                            </motion.div>
                        ) : (
                            <motion.span 
                                key={`empty-${i}`}
                                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                                className="absolute text-cyan-500/30 text-[10px] font-black font-mono tracking-widest group-hover:opacity-100 cursor-pointer w-full h-full flex items-center justify-center"
                                onClick={(e) => onEntityClick(null, isOpponentSide, e)}
                            >
                                SLOT_{i + 1}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            );
        });
    };

    return (
        <div className="absolute inset-0 pointer-events-auto" onWheel={handleWheel}>
            <motion.div
                drag dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }} dragElastic={0.05}
                animate={{ scale: zoom }} transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1200px]"
            >
                <div className={cn(
                    "w-[1050px] h-[800px] transform rotate-x-[55deg] relative flex flex-col justify-center items-center gap-6 rounded-[3rem] border-[4px] border-cyan-900/80 bg-zinc-950/90 shadow-[0_0_100px_rgba(6,182,212,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-500",
                    activeAttackerId ? "border-red-900/80 shadow-[0_0_100px_rgba(239,68,68,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)]" : ""
                )}>
                    
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none rounded-[3rem]" />

                    {/* --- ZONA DEL OPONENTE --- */}
                    <div className={cn("flex w-full justify-center items-center gap-8 mb-4 z-10 p-4 rounded-2xl transition-colors duration-300", activeAttackerId ? "bg-red-950/30 cursor-crosshair" : "")}>
                        
                        {/* OPONENTE GRAVEYARD */}
                        <div className="relative w-24 h-36 border-2 border-dashed border-red-500/40 bg-red-950/20 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] overflow-hidden">
                            {opponentTopGraveCard ? (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="scale-[0.25] origin-center opacity-70 grayscale-[0.3]">
                                        <Card card={opponentTopGraveCard} />
                                    </div>
                                </div>
                            ) : null}
                            <span className="relative z-10 font-black text-[10px] uppercase tracking-widest text-red-400 bg-black/80 px-2 py-0.5 rounded backdrop-blur-sm mt-1 border border-red-500/30">Grave</span>
                            <span className="relative z-10 text-xs mt-1 font-mono font-black text-white bg-red-900/90 border border-red-500/50 px-2 py-0.5 rounded shadow-lg">{opponentGraveyardCount}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 opacity-60">{renderSlots(opponentActiveExecutions, 3, true)}</div>
                            <div className="flex gap-3">{renderSlots(opponentActiveEntities, 3, true)}</div>
                        </div>

                        {/* OPONENTE DECK */}
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center bg-black/50 overflow-hidden">
                            {opponentDeckCount > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="scale-[0.25] origin-center opacity-80">
                                        <CardBack />
                                    </div>
                                </div>
                            )}
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]">{opponentDeckCount}</span>
                        </div>
                    </div>

                    <div className="w-[85%] h-1.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] opacity-70 z-10 rounded-full" />

                    {/* --- ZONA DEL JUGADOR --- */}
                    <div className="flex w-full justify-center items-center gap-8 mt-4 z-10 p-4">
                        
                        {/* PLAYER GRAVEYARD */}
                        <div className="relative w-24 h-36 border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.2)] overflow-hidden">
                            {playerTopGraveCard ? (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="scale-[0.25] origin-center opacity-70 grayscale-[0.3]">
                                        <Card card={playerTopGraveCard} />
                                    </div>
                                </div>
                            ) : null}
                            <span className="relative z-10 font-black text-[10px] uppercase tracking-widest text-cyan-400 bg-black/80 px-2 py-0.5 rounded backdrop-blur-sm mt-1 border border-cyan-500/30">Grave</span>
                            <span className="relative z-10 text-xs mt-1 font-mono font-black text-white bg-cyan-900/90 border border-cyan-500/50 px-2 py-0.5 rounded shadow-lg">{playerGraveyardCount}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">{renderSlots(playerActiveEntities, 3, false)}</div>
                            <div className="flex gap-3 opacity-60">{renderSlots(playerActiveExecutions, 3, false)}</div>
                        </div>

                        {/* PLAYER DECK */}
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center bg-black/50 overflow-hidden">
                            {playerDeckCount > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="scale-[0.25] origin-center opacity-80">
                                        <CardBack />
                                    </div>
                                </div>
                            )}
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]">{playerDeckCount}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}