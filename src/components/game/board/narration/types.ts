// src/components/game/board/narration/types.ts - Define contratos de narración reactiva para HUD y cinemáticas durante el combate.
import { ICombatLogEvent } from "@/core/entities/ICombatLog";

export type MatchNarrationTrigger =
  | "MATCH_START"
  | "DIRECT_HIT_DEALT"
  | "DIRECT_HIT_TAKEN"
  | "OPPONENT_TRAP_TRIGGERED"
  | "FUSION_SUMMONED"
  | "PLAYER_WIN"
  | "PLAYER_LOSE";

export type MatchNarrationChannel = "HUD" | "CINEMATIC";

export interface IMatchNarrationLine {
  id: string;
  trigger: MatchNarrationTrigger;
  channel: MatchNarrationChannel;
  actor: "PLAYER" | "OPPONENT";
  text: string;
  audioUrl?: string | null;
  portraitUrl?: string | null;
  durationMs?: number;
}

export interface IMatchNarrationPack {
  lines: IMatchNarrationLine[];
}

export interface IMatchNarrationContext {
  playerId: string;
  opponentId: string;
}

export interface IResolvedNarrationAction {
  line: IMatchNarrationLine;
  actorPlayerId: string;
  sourceEvent: ICombatLogEvent | null;
}
