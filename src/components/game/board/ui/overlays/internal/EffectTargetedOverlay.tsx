// src/components/game/board/ui/overlays/internal/EffectTargetedOverlay.tsx - Overlay global con cola secuencial de bloqueo y buff/debuff para respetar orden del combatLog.
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ICombatLogEvent } from "@/core/entities/ICombatLog";
import { IPoint, resolveFallbackTrajectory, resolveSourceFromBoard } from "./direct-damage-beam-overlay-logic";
import { ITargetedStatSignal, ITrapBlockSignal, resolveStatSignalAt, resolveTrapBlockSignalAt } from "./effect-targeted-overlay-logic";

interface IEffectTargetedOverlayProps {
  events: ICombatLogEvent[];
  playerAId: string;
}

type OverlaySignal =
  | { kind: "TRAP"; payload: ITrapBlockSignal }
  | { kind: "STAT"; payload: ITargetedStatSignal };

function findEntityPoint(root: HTMLDivElement, instanceId: string): IPoint | null {
  const node = document.querySelector<HTMLElement>(`[data-board-entity-instance-id="${instanceId}"]`);
  if (!node) return null;
  const rootRect = root.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  return { x: ((rect.left + rect.width / 2 - rootRect.left) / Math.max(rootRect.width, 1)) * 1000, y: ((rect.top + rect.height / 2 - rootRect.top) / Math.max(rootRect.height, 1)) * 1000 };
}

function findSlotPoint(root: HTMLDivElement, isOpponentSide: boolean, laneType: "ENTITIES" | "EXECUTIONS", slotIndex: number): IPoint | null {
  const node = root.querySelector<HTMLElement>(
    `[data-board-slot-side="${isOpponentSide ? "opponent" : "player"}"][data-board-lane-type="${laneType}"][data-slot-index="${slotIndex}"]`,
  );
  if (!node) return null;
  const rootRect = root.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  return { x: ((rect.left + rect.width / 2 - rootRect.left) / Math.max(rootRect.width, 1)) * 1000, y: ((rect.top + rect.height / 2 - rootRect.top) / Math.max(rootRect.height, 1)) * 1000 };
}

function resolveStatColor(amount: number): { glow: string; core: string } {
  return amount >= 0
    ? { glow: "drop-shadow(0 0 18px rgba(250,204,21,0.9))", core: "rgba(250,204,21,0.92)" }
    : { glow: "drop-shadow(0 0 18px rgba(192,132,252,0.95))", core: "rgba(192,132,252,0.92)" };
}

function renderBeam(source: IPoint, target: IPoint, color: { glow: string; core: string }, key: string, delay = 0) {
  const controlX = (source.x + target.x) / 2;
  const curveDirection = source.x > target.x ? -1 : 1;
  const controlY = (source.y + target.y) / 2 - 44;
  const controlXAlt = controlX + 22 * curveDirection;
  const path = `M ${source.x} ${source.y} Q ${controlX} ${controlY} ${target.x} ${target.y}`;
  const pathAlt = `M ${source.x} ${source.y} Q ${controlXAlt} ${controlY - 18} ${target.x} ${target.y}`;
  return (
    <svg key={key} className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <motion.path d={pathAlt} fill="none" stroke={color.core} strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1], opacity: [0, 0.96, 0] }} transition={{ duration: 0.62, delay, ease: "easeOut" }} style={{ filter: color.glow }} />
      <motion.path d={path} fill="none" stroke={color.core} strokeWidth={9} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }} transition={{ duration: 0.62, delay, ease: "easeOut" }} style={{ filter: color.glow }} />
    </svg>
  );
}

export function EffectTargetedOverlay({ events, playerAId }: IEffectTargetedOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const processedEventIndexRef = useRef(0);
  const [queuedSignals, setQueuedSignals] = useState<OverlaySignal[]>([]);
  const [activeSignal, setActiveSignal] = useState<OverlaySignal | null>(null);
  const [statTargetPoints, setStatTargetPoints] = useState<IPoint[]>([]);
  const [statSourcePoint, setStatSourcePoint] = useState<IPoint | null>(null);
  const [trapTargetPoint, setTrapTargetPoint] = useState<IPoint | null>(null);
  const [trapSourcePoint, setTrapSourcePoint] = useState<IPoint | null>(null);

  useEffect(() => {
    const startIndex = processedEventIndexRef.current;
    if (events.length <= startIndex) return;
    const nextSignals: OverlaySignal[] = [];
    for (let index = startIndex; index < events.length; index += 1) {
      const trapSignal = resolveTrapBlockSignalAt(events, index, playerAId);
      if (trapSignal) {
        nextSignals.push({ kind: "TRAP", payload: trapSignal });
        continue;
      }
      const statSignal = resolveStatSignalAt(events, index, playerAId);
      if (statSignal) nextSignals.push({ kind: "STAT", payload: statSignal });
    }
    processedEventIndexRef.current = events.length;
    if (nextSignals.length === 0) return;
    const timer = window.setTimeout(() => {
      setQueuedSignals((previous) => [...previous, ...nextSignals]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [events, playerAId]);

  useEffect(() => {
    if (activeSignal || queuedSignals.length === 0) return;
    const timer = window.setTimeout(() => {
      setActiveSignal(queuedSignals[0]);
      setQueuedSignals((previous) => previous.slice(1));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeSignal, queuedSignals]);

  useEffect(() => {
    if (!activeSignal) return;
    const durationMs = activeSignal.kind === "TRAP" ? 760 : 1100;
    const timer = window.setTimeout(() => setActiveSignal(null), durationMs);
    return () => window.clearTimeout(timer);
  }, [activeSignal]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (!overlayRef.current || !activeSignal || activeSignal.kind !== "STAT") {
        setStatSourcePoint(null);
        setStatTargetPoints([]);
        return;
      }
      const statSignal = activeSignal.payload;
      const source = statSignal.sourceCardId
        ? resolveSourceFromBoard(overlayRef.current, statSignal.sourceCardId, statSignal.actorIsPlayerA)
        : resolveFallbackTrajectory(false, statSignal.actorIsPlayerA).source;
      const targets = statSignal.targetEntityIds.map((entityId) => findEntityPoint(overlayRef.current as HTMLDivElement, entityId)).filter((value): value is IPoint => value !== null);
      setStatSourcePoint(source);
      setStatTargetPoints(targets);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeSignal]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (!overlayRef.current || !activeSignal || activeSignal.kind !== "TRAP") {
        setTrapSourcePoint(null);
        setTrapTargetPoint(null);
        return;
      }
      const trapSignal = activeSignal.payload;
      const source = resolveSourceFromBoard(overlayRef.current, trapSignal.trapCardId, trapSignal.actorIsPlayerA)
        ?? findSlotPoint(overlayRef.current, !trapSignal.actorIsPlayerA, "EXECUTIONS", trapSignal.trapSlotIndex)
        ?? resolveFallbackTrajectory(false, trapSignal.actorIsPlayerA).source;
      const targetId = trapSignal.blockedTargetEntityInstanceId ?? trapSignal.destroyedTargetEntityInstanceId;
      const target = targetId
        ? findEntityPoint(overlayRef.current, targetId)
        : trapSignal.destroyedTargetEntitySlotIndex !== null
          ? findSlotPoint(overlayRef.current, !trapSignal.targetIsPlayerA, "ENTITIES", trapSignal.destroyedTargetEntitySlotIndex)
          : null;
      setTrapSourcePoint(source);
      setTrapTargetPoint(target);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeSignal]);

  const currentStatSignal = activeSignal?.kind === "STAT" ? activeSignal.payload : null;
  const currentTrapSignal = activeSignal?.kind === "TRAP" ? activeSignal.payload : null;
  const statColor = resolveStatColor(currentStatSignal?.amount ?? 0);
  const trapDestroyColor = { glow: "drop-shadow(0 0 18px rgba(248,113,113,0.95))", core: "rgba(248,113,113,0.94)" };

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-[390] overflow-hidden">
      {currentTrapSignal && trapTargetPoint ? (
        <motion.div initial={{ opacity: 0, scale: 0.68, y: 10 }} animate={{ opacity: [0, 1, 0], scale: [0.68, 1.2, 0.92], y: [10, -6, -18] }} transition={{ duration: 0.48, ease: "easeOut" }} className="absolute z-[391] rounded-full border-2 border-red-300/90 bg-red-950/78 px-3 py-2 text-sm font-black tracking-[0.2em] text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.95)]" style={{ left: `${(trapTargetPoint.x / 1000) * 100}%`, top: `${(trapTargetPoint.y / 1000) * 100}%`, transform: "translate(-50%,-50%)" }}>
          LOCK
        </motion.div>
      ) : null}
      {currentTrapSignal && trapTargetPoint && trapSourcePoint && currentTrapSignal.action === "NEGATE_ATTACK_AND_DESTROY_ATTACKER" ? renderBeam(trapSourcePoint, trapTargetPoint, trapDestroyColor, `${currentTrapSignal.id}-destroy`, 0.16) : null}
      {currentStatSignal && statSourcePoint ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.64 }}
            animate={{ opacity: [0, 1, 0.88, 0], scale: [0.64, 1.06, 1.22, 1.02] }}
            transition={{ duration: 0.64, ease: "easeOut" }}
            className={currentStatSignal.amount >= 0 ? "absolute h-20 w-20 rounded-full bg-yellow-300/70 blur-sm" : "absolute h-20 w-20 rounded-full bg-violet-300/70 blur-sm"}
            style={{ left: `${(statSourcePoint.x / 1000) * 100}%`, top: `${(statSourcePoint.y / 1000) * 100}%`, transform: "translate(-50%,-50%)" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.68 }}
            animate={{ opacity: [0, 0.92, 0], y: [12, -20, -42], scale: [0.68, 1.04, 0.9] }}
            transition={{ duration: 0.62, ease: "easeOut" }}
            className={currentStatSignal.amount >= 0 ? "absolute h-16 w-10 rounded-full bg-amber-300/70 blur-md" : "absolute h-16 w-10 rounded-full bg-fuchsia-300/70 blur-md"}
            style={{ left: `${(statSourcePoint.x / 1000) * 100}%`, top: `${(statSourcePoint.y / 1000) * 100}%`, transform: "translate(-50%,-50%)" }}
          />
        </>
      ) : null}
      {currentStatSignal && statSourcePoint ? statTargetPoints.map((targetPoint, index) => renderBeam(statSourcePoint, targetPoint, statColor, `${currentStatSignal.id}-target-${index}`, 0.38 + index * 0.08)) : null}
    </div>
  );
}
