// src/components/game/board/ui/layers/internal/DrawCardFlowVfx.tsx - Overlay de robo de carta desde deck hacia mano según eventos del combatLog.
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { ICombatLogEvent } from "@/core/entities/ICombatLog";

interface IDrawCardFlowVfxProps {
  combatLog: ICombatLogEvent[];
  playerId: string;
}

interface IDrawEventSignal {
  id: string;
  isOpponent: boolean;
}

function resolveLatestDrawEvent(events: ICombatLogEvent[], playerId: string): IDrawEventSignal | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (event.eventType !== "CARD_PLAYED") continue;
    const payload = typeof event.payload === "object" && event.payload !== null ? (event.payload as Record<string, unknown>) : null;
    const cardType = payload && typeof payload.cardType === "string" ? payload.cardType : "";
    const mode = payload && typeof payload.mode === "string" ? payload.mode : "";
    const action = payload && typeof payload.effectAction === "string" ? payload.effectAction : "";
    if (cardType !== "EXECUTION" || mode !== "ACTIVATE" || action !== "DRAW_CARD") continue;
    return { id: event.id, isOpponent: event.actorPlayerId !== playerId };
  }
  return null;
}

export function DrawCardFlowVfx({ combatLog, playerId }: IDrawCardFlowVfxProps) {
  const latestDrawSignal = useMemo(() => resolveLatestDrawEvent(combatLog, playerId), [combatLog, playerId]);
  if (!latestDrawSignal) return null;

  const startX = latestDrawSignal.isOpponent ? 340 : -340;
  const startY = latestDrawSignal.isOpponent ? -250 : 210;
  const endX = latestDrawSignal.isOpponent ? 70 : -70;
  const endY = latestDrawSignal.isOpponent ? -360 : 350;

  return (
    <div key={latestDrawSignal.id} className="pointer-events-none absolute inset-0 z-[230] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: startX, y: startY, scale: 0.42, rotate: latestDrawSignal.isOpponent ? -8 : 8 }}
        animate={{ opacity: [0, 1, 1, 0], x: [startX, endX], y: [startY, endY], scale: [0.42, 0.34], rotate: [latestDrawSignal.isOpponent ? -8 : 8, 0] }}
        transition={{ duration: 0.92, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-24 w-16 -translate-x-1/2 -translate-y-1/2 rounded-md border border-cyan-200/70 bg-gradient-to-b from-cyan-300/35 to-blue-600/30 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
      />
      <motion.div
        initial={{ opacity: 0, x: startX, y: startY, scaleX: 0.4 }}
        animate={{ opacity: [0, 0.85, 0], x: [startX, endX], y: [startY, endY], scaleX: [0.4, 1.3, 0.6] }}
        transition={{ duration: 0.92, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/70 blur-sm"
      />
    </div>
  );
}
