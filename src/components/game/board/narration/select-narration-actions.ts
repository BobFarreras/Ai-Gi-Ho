// src/components/game/board/narration/select-narration-actions.ts - Traduce eventos del combatLog y estado final a acciones de narración en cola.
import { ICombatLogEvent } from "@/core/entities/ICombatLog";
import { IMatchNarrationContext, IMatchNarrationPack, IResolvedNarrationAction } from "./types";

function resolveActorPlayerId(actor: "PLAYER" | "OPPONENT", context: IMatchNarrationContext): string {
  return actor === "PLAYER" ? context.playerId : context.opponentId;
}

function pickLine(pack: IMatchNarrationPack, trigger: string, preferredActor: "PLAYER" | "OPPONENT") {
  return pack.lines.find((line) => line.trigger === trigger && line.actor === preferredActor) ?? pack.lines.find((line) => line.trigger === trigger) ?? null;
}

export function selectNarrationActionsFromEvents(
  events: ICombatLogEvent[],
  pack: IMatchNarrationPack,
  context: IMatchNarrationContext,
): IResolvedNarrationAction[] {
  const actions: IResolvedNarrationAction[] = [];
  let hasMatchStart = false;
  for (const event of events) {
    if (event.eventType === "TURN_STARTED" && !hasMatchStart) {
      hasMatchStart = true;
      const line = pickLine(pack, "MATCH_START", "OPPONENT");
      if (line) actions.push({ line, actorPlayerId: resolveActorPlayerId(line.actor, context), sourceEvent: event });
      continue;
    }
    if (event.eventType === "FUSION_SUMMONED") {
      const preferredActor = event.actorPlayerId === context.playerId ? "PLAYER" : "OPPONENT";
      const line = pickLine(pack, "FUSION_SUMMONED", preferredActor);
      if (line) actions.push({ line, actorPlayerId: resolveActorPlayerId(line.actor, context), sourceEvent: event });
      continue;
    }
    if (event.eventType === "TRAP_TRIGGERED") {
      const preferredActor = event.actorPlayerId === context.playerId ? "PLAYER" : "OPPONENT";
      const line = pickLine(pack, "OPPONENT_TRAP_TRIGGERED", preferredActor);
      if (line) actions.push({ line, actorPlayerId: resolveActorPlayerId(line.actor, context), sourceEvent: event });
      continue;
    }
    if (event.eventType === "BATTLE_RESOLVED") {
      const hasDirectHit = typeof event.payload.defenderCardId !== "string";
      if (!hasDirectHit) continue;
      const trigger = event.actorPlayerId === context.playerId ? "DIRECT_HIT_DEALT" : "DIRECT_HIT_TAKEN";
      const preferredActor = event.actorPlayerId === context.playerId ? "PLAYER" : "OPPONENT";
      const line = pickLine(pack, trigger, preferredActor);
      if (line) actions.push({ line, actorPlayerId: resolveActorPlayerId(line.actor, context), sourceEvent: event });
    }
  }
  return actions;
}

export function selectNarrationActionForResult(
  winnerPlayerId: string | "DRAW" | null,
  pack: IMatchNarrationPack,
  context: IMatchNarrationContext,
): IResolvedNarrationAction | null {
  if (!winnerPlayerId || winnerPlayerId === "DRAW") return null;
  const trigger = winnerPlayerId === context.playerId ? "PLAYER_WIN" : "PLAYER_LOSE";
  const preferredActor = winnerPlayerId === context.playerId ? "PLAYER" : "OPPONENT";
  const line = pickLine(pack, trigger, preferredActor);
  if (!line) return null;
  return { line, actorPlayerId: resolveActorPlayerId(line.actor, context), sourceEvent: null };
}
