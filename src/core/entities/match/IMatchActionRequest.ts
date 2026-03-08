// src/core/entities/match/IMatchActionRequest.ts - Contrato de acción genérica enviada al controller de combate por modo.
export interface IMatchActionRequest {
  type: string;
  actorPlayerId: string;
  payload?: Record<string, unknown>;
}
