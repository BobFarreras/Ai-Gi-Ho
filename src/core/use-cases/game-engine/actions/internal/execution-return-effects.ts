// src/core/use-cases/game-engine/actions/internal/execution-return-effects.ts - Resuelve retornos desde cementerio a mano/campo con reglas de overflow seguro.
import { CardType, IReturnGraveyardCardToFieldEffect, IReturnGraveyardCardToHandEffect } from "@/core/entities/ICard";
import { BattleMode, IPlayer } from "@/core/entities/IPlayer";
import { GameRuleError } from "@/core/errors/GameRuleError";

export interface IExecutionSystemEvent {
  eventType: "CARD_TO_DESTROYED";
  payload: Record<string, unknown>;
}

function pickGraveyardCard(graveyard: readonly { id: string; type: CardType }[], cardType?: CardType): string | null {
  for (let index = graveyard.length - 1; index >= 0; index -= 1) {
    const card = graveyard[index];
    if (!cardType || card.type === cardType) return card.id;
  }
  return null;
}

function createRevivedEntity(cardId: string, cardType: CardType, cardIndex: number): { instanceId: string; mode: BattleMode } {
  const mode: BattleMode = cardType === "ENTITY" ? "ATTACK" : "SET";
  return { instanceId: `revived-${cardId}-${Date.now()}-${cardIndex}`, mode };
}

export function applyReturnGraveyardCardToHand(
  player: IPlayer,
  effect: IReturnGraveyardCardToHandEffect,
): { updatedPlayer: IPlayer; events: IExecutionSystemEvent[] } {
  const targetId = pickGraveyardCard(player.graveyard, effect.cardType);
  if (!targetId) throw new GameRuleError("No hay cartas válidas en cementerio para devolver a la mano.");
  const targetIndex = player.graveyard.findIndex((card) => card.id === targetId);
  const targetCard = player.graveyard[targetIndex];
  const nextGraveyard = player.graveyard.filter((_, index) => index !== targetIndex);
  const events: IExecutionSystemEvent[] = [];
  let nextHand = [...player.hand];
  let nextDestroyed = [...(player.destroyedPile ?? [])];
  if (nextHand.length >= 5) {
    const destroyedFromHand = nextHand[0];
    nextHand = nextHand.slice(1);
    nextDestroyed = [...nextDestroyed, destroyedFromHand];
    events.push({
      eventType: "CARD_TO_DESTROYED",
      payload: { cardId: destroyedFromHand.id, ownerPlayerId: player.id, from: "HAND" },
    });
  }
  nextHand = [...nextHand, targetCard];
  return {
    updatedPlayer: { ...player, hand: nextHand, graveyard: nextGraveyard, destroyedPile: nextDestroyed },
    events,
  };
}

export function applyReturnGraveyardCardToField(
  player: IPlayer,
  effect: IReturnGraveyardCardToFieldEffect,
): { updatedPlayer: IPlayer; events: IExecutionSystemEvent[] } {
  const targetId = pickGraveyardCard(player.graveyard, effect.cardType);
  if (!targetId) throw new GameRuleError("No hay cartas válidas en cementerio para devolver al tablero.");
  const targetIndex = player.graveyard.findIndex((card) => card.id === targetId);
  const targetCard = player.graveyard[targetIndex];
  const nextGraveyard = player.graveyard.filter((_, index) => index !== targetIndex);
  const events: IExecutionSystemEvent[] = [];
  const isEntity = targetCard.type === "ENTITY";
  let nextEntities = [...player.activeEntities];
  let nextExecutions = [...player.activeExecutions];
  let nextDestroyed = [...(player.destroyedPile ?? [])];
  if (isEntity) {
    if (nextEntities.length >= 3) {
      const destroyedEntity = nextEntities[0];
      nextEntities = nextEntities.slice(1);
      nextDestroyed = [...nextDestroyed, destroyedEntity.card];
      events.push({
        eventType: "CARD_TO_DESTROYED",
        payload: { cardId: destroyedEntity.card.id, ownerPlayerId: player.id, from: "BATTLEFIELD" },
      });
    }
    const revived = createRevivedEntity(targetCard.id, targetCard.type, nextEntities.length);
    nextEntities = [...nextEntities, { instanceId: revived.instanceId, card: targetCard, mode: revived.mode, hasAttackedThisTurn: false, isNewlySummoned: true }];
  } else {
    if (nextExecutions.length >= 3) {
      const destroyedExecution = nextExecutions[0];
      nextExecutions = nextExecutions.slice(1);
      nextDestroyed = [...nextDestroyed, destroyedExecution.card];
      events.push({
        eventType: "CARD_TO_DESTROYED",
        payload: { cardId: destroyedExecution.card.id, ownerPlayerId: player.id, from: "EXECUTION_ZONE" },
      });
    }
    const revived = createRevivedEntity(targetCard.id, targetCard.type, nextExecutions.length);
    nextExecutions = [...nextExecutions, { instanceId: revived.instanceId, card: targetCard, mode: revived.mode, hasAttackedThisTurn: false, isNewlySummoned: true }];
  }
  return {
    updatedPlayer: {
      ...player,
      graveyard: nextGraveyard,
      activeEntities: nextEntities,
      activeExecutions: nextExecutions,
      destroyedPile: nextDestroyed,
    },
    events,
  };
}
