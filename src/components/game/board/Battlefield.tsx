// src/components/game/board/Battlefield.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IBoardEntity } from "@/core/entities/IPlayer";
import { ICard } from "@/core/entities/ICard";
import { cn } from "@/lib/utils";
import { CardBack } from "../card/CardBack";
import { Card } from "../card/Card";

// Componente interno para el Rayo Espectacular
function DigitalBeam({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scaleX: 0 }}
      animate={{ 
        y: [0, -1200], 
        opacity: [0, 1, 1, 0],
        scaleX: [1, 2, 1, 0.5],
        scaleY: [0, 1, 4, 1]
      }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      onAnimationComplete={onComplete}
      className="absolute z-[200] pointer-events-none"
      style={{ rotateX: -55 }}
    >
      {/* Núcleo del Rayo */}
      <div className="w-4 h-96 bg-white shadow-[0_0_50px_#22d3ee,0_0_100px_#06b6d4] rounded-full" />
      {/* Partículas de "Datos" laterales */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-cyan-500/20 blur-xl" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-cyan-200 animate-pulse" />
    </motion.div>
  );
}

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
    revealedEntities?: string[]; 
    onEntityClick: (entity: IBoardEntity | null, isOpponentSide: boolean, e: React.MouseEvent) => void;
}

export function Battlefield({
    playerActiveEntities, playerActiveExecutions,
    opponentActiveEntities, opponentActiveExecutions,
    playerDeckCount, opponentDeckCount,
    playerTopGraveCard, opponentTopGraveCard,
    playerGraveyardCount, opponentGraveyardCount,
    activeAttackerId, selectedCard, 
    revealedEntities = [], 
    onEntityClick
}: BattlefieldProps) {
    const [zoom, setZoom] = useState(1);
    const [activeProjectiles, setActiveProjectiles] = useState<string[]>([]);

    // Escuchamos si alguna carta entra en modo ACTIVATE para disparar el efecto
    useEffect(() => {
        playerActiveExecutions.forEach(e => {
            if (e.mode === 'ACTIVATE' && !activeProjectiles.includes(e.instanceId)) {
                setActiveProjectiles(prev => [...prev, e.instanceId]);
            }
        });
    }, [playerActiveExecutions]);

    const handleWheel = (e: React.WheelEvent) => {
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.6), 1.6));
    };

    const renderSlots = (entities: IBoardEntity[], total: number, isOpponentSide: boolean) => {
        return Array.from({ length: total }).map((_, i) => {
            const entity = entities[i];
            const isAttacking = entity?.instanceId === activeAttackerId;
            const isRevealed = entity ? revealedEntities.includes(entity.instanceId) : false;
            const isActivating = entity?.mode === 'ACTIVATE';
            const isFaceDown = (entity?.mode === 'DEFENSE' || entity?.mode === 'SET') && !isRevealed;
            const isHorizontal = entity?.mode === 'DEFENSE' || (entity?.mode === 'SET' && entity.card.type === 'ENTITY');
            const targetX = -120 - (i * 105);

            return (
                <div key={i} style={{ transformStyle: "preserve-3d" }} className="relative w-24 h-36 border-2 border-cyan-500/30 rounded-lg bg-cyan-950/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)_inset] group hover:border-cyan-300 transition-colors duration-300">
                    
                    {/* SI HAY UN PROYECTIL ACTIVO PARA ESTE SLOT, SE RENDERIZA AQUÍ FUERA DE LA CARTA */}
                    {entity && activeProjectiles.includes(entity.instanceId) && (
                        <DigitalBeam onComplete={() => {
                            setActiveProjectiles(prev => prev.filter(id => id !== entity.instanceId));
                        }} />
                    )}

                    <AnimatePresence>
                        {entity ? (
                            <motion.div
                                key={entity.instanceId}
                                style={{ transformStyle: "preserve-3d" }}
                                initial={{ opacity: 0, scale: 0.2, y: -50 }}
                                animate={{
                                    opacity: 1,
                                    scale: isAttacking ? 0.38 : (isActivating ? 0.35 : 0.28),
                                    y: isAttacking ? (isOpponentSide ? 30 : -30) : (isActivating ? -20 : 0),
                                    zIndex: (isAttacking || isActivating) ? 50 : 10,
                                    rotateY: isFaceDown ? 180 : 0, 
                                    rotateZ: isHorizontal ? -90 : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                exit={{
                                    opacity: [1, 0], scale: [0.28, 0.1], 
                                    x: targetX, y: 0,
                                    transition: { duration: 0.4 }
                                }}
                                className={cn(
                                    "w-[260px] h-[340px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center cursor-pointer",
                                    isAttacking ? "ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,1)] animate-pulse rounded-xl" : ""
                                )}
                                onClick={(e) => onEntityClick(entity, isOpponentSide, e)}
                            >
                                <div className="absolute w-full h-full flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                                    <Card card={entity.card} isSelected={selectedCard?.id === entity.card.id} boardMode={entity.mode} />
                                    
                                    {/* Flash de carga inicial en la carta */}
                                    {isActivating && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: [0, 1, 0], scale: [1, 2.5] }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 bg-white rounded-xl mix-blend-overlay z-50"
                                        />
                                    )}
                                </div>

                                <div className="absolute w-full h-full flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                                    <CardBack />
                                </div>
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
                {/* Tablero */}
                <div style={{ transformStyle: "preserve-3d" }} className={cn(
                    "w-[1050px] h-[800px] transform rotate-x-[55deg] relative flex flex-col justify-center items-center gap-6 rounded-[3rem] border-[4px] border-cyan-900/80 bg-zinc-950/90 shadow-[0_0_100px_rgba(6,182,212,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-500",
                    activeAttackerId ? "border-red-900/80 shadow-[0_0_100px_rgba(239,68,68,0.2)_inset,0_50px_100px_rgba(0,0,0,0.9)]" : ""
                )}>
                    {/* ... (Resto del código de zonas y cementerios igual que antes) ... */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none rounded-[3rem]" />

                    {/* ZONA OPONENTE */}
                    <div style={{ transformStyle: "preserve-3d" }} className={cn("flex w-full justify-center items-center gap-8 mb-4 z-10 p-4 rounded-2xl transition-colors duration-300", activeAttackerId ? "bg-red-950/30 cursor-crosshair" : "")}>
                        <div className="relative w-24 h-36 border-2 border-dashed border-red-500/40 bg-red-950/20 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] overflow-hidden">
                            {opponentTopGraveCard && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="scale-[0.25] origin-center opacity-70 grayscale-[0.3]"><Card card={opponentTopGraveCard} /></div></div>}
                            <span className="relative z-10 font-black text-[10px] uppercase tracking-widest text-red-400 bg-black/80 px-2 py-0.5 rounded mt-1 border border-red-500/30">Grave</span>
                            <span className="relative z-10 text-xs mt-1 font-mono font-black text-white bg-red-900/90 border border-red-500/50 px-2 py-0.5 rounded shadow-lg">{opponentGraveyardCount}</span>
                        </div>
                        <div className="flex flex-col gap-3" style={{ transformStyle: "preserve-3d" }}>
                            <div className="flex gap-3 opacity-60" style={{ transformStyle: "preserve-3d" }}>{renderSlots(opponentActiveExecutions, 3, true)}</div>
                            <div className="flex gap-3" style={{ transformStyle: "preserve-3d" }}>{renderSlots(opponentActiveEntities, 3, true)}</div>
                        </div>
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center bg-black/50 overflow-hidden">
                            {opponentDeckCount > 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="scale-[0.25] origin-center opacity-80"><CardBack /></div></div>}
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80">{opponentDeckCount}</span>
                        </div>
                    </div>

                    <div className="w-[85%] h-1.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] opacity-70 z-10 rounded-full" />

                    {/* ZONA JUGADOR */}
                    <div style={{ transformStyle: "preserve-3d" }} className="flex w-full justify-center items-center gap-8 mt-4 z-10 p-4">
                        <div className="relative w-24 h-36 border-2 border-dashed border-cyan-500/40 bg-cyan-950/20 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.2)] overflow-hidden">
                            {playerTopGraveCard && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="scale-[0.25] origin-center opacity-70 grayscale-[0.3]"><Card card={playerTopGraveCard} /></div></div>}
                            <span className="relative z-10 font-black text-[10px] uppercase tracking-widest text-cyan-400 bg-black/80 px-2 py-0.5 rounded mt-1 border border-cyan-500/30">Grave</span>
                            <span className="relative z-10 text-xs mt-1 font-mono font-black text-white bg-cyan-900/90 border border-cyan-500/50 px-2 py-0.5 rounded shadow-lg">{playerGraveyardCount}</span>
                        </div>
                        <div className="flex flex-col gap-3" style={{ transformStyle: "preserve-3d" }}>
                            <div className="flex gap-3" style={{ transformStyle: "preserve-3d" }}>{renderSlots(playerActiveEntities, 3, false)}</div>
                            <div className="flex gap-3 opacity-60" style={{ transformStyle: "preserve-3d" }}>{renderSlots(playerActiveExecutions, 3, false)}</div>
                        </div>
                        <div className="relative w-24 h-36 border-2 border-zinc-700/80 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center bg-black/50 overflow-hidden">
                            {playerDeckCount > 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="scale-[0.25] origin-center opacity-80"><CardBack /></div></div>}
                            <span className="relative z-10 bg-black/90 px-3 py-1 rounded-md text-cyan-400 font-mono text-sm border border-cyan-900/80">{playerDeckCount}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}