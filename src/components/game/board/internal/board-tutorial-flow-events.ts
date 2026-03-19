// src/components/game/board/internal/board-tutorial-flow-events.ts - Helpers puros para consultar eventos del combatLog en tutorial de combate.
import { ICombatLogEvent } from "@/core/entities/ICombatLog";

export function hasEvent(events: ICombatLogEvent[], eventType: ICombatLogEvent["eventType"]): boolean {
  return events.some((event) => event.eventType === eventType);
}

export function hasCardPlayed(events: ICombatLogEvent[], cardId: string, mode?: string): boolean {
  return events.some((event) => {
    if (event.eventType !== "CARD_PLAYED") return false;
    const sameCard = event.payload.cardId === cardId;
    if (!sameCard) return false;
    return mode ? event.payload.mode === mode : true;
  });
}

export function hasOpponentTurnStarted(events: ICombatLogEvent[]): boolean {
  return events.some((event) => event.eventType === "TURN_STARTED" && event.actorPlayerId === "opponent-local");
}

export function hasPlayerBattlePhase(events: ICombatLogEvent[]): boolean {
  return events.some((event) => event.eventType === "PHASE_CHANGED" && event.actorPlayerId === "player-local" && event.payload.toPhase === "BATTLE");
}

export function hasTrapResolution(events: ICombatLogEvent[]): boolean {
  return events.some((event) => event.eventType === "TRAP_TRIGGERED");
}

export function countPlayerDirectDamage(events: ICombatLogEvent[]): number {
  return events.filter((event) => event.eventType === "DIRECT_DAMAGE" && event.actorPlayerId === "player-local").length;
}
