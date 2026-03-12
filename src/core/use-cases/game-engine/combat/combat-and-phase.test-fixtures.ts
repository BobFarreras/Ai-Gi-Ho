// src/core/use-cases/game-engine/combat/combat-and-phase.test-fixtures.ts - Fixtures compartidas para pruebas de combate y transición de turno.
import { ICard } from "@/core/entities/ICard";
import { IBoardEntity } from "@/core/entities/IPlayer";
import { GameState } from "@/core/use-cases/GameEngine";

export const attackerCard: ICard = {
  id: "atk-1",
  name: "Attacker",
  description: "Entidad atacante.",
  type: "ENTITY",
  faction: "BIG_TECH",
  cost: 1,
  attack: 1500,
  defense: 1000,
};

export const defenderCard: ICard = {
  id: "def-1",
  name: "Defender",
  description: "Entidad defensora.",
  type: "ENTITY",
  faction: "OPEN_SOURCE",
  cost: 1,
  attack: 2000,
  defense: 2200,
};

export function createEntity(instanceId: string, card: ICard, mode: "ATTACK" | "DEFENSE" | "SET", attacked = false): IBoardEntity {
  return {
    instanceId,
    card,
    mode,
    hasAttackedThisTurn: attacked,
    isNewlySummoned: false,
  };
}

/**
 * Estado base para pruebas de combate en turno 2 con ambos jugadores en fase BATTLE.
 */
export function createCombatState(): GameState {
  return {
    playerA: {
      id: "p1",
      name: "Neo",
      healthPoints: 8000,
      maxHealthPoints: 8000,
      currentEnergy: 10,
      maxEnergy: 10,
      deck: [],
      hand: [],
      graveyard: [],
      activeEntities: [createEntity("a-1", attackerCard, "ATTACK")],
      activeExecutions: [],
    },
    playerB: {
      id: "p2",
      name: "Smith",
      healthPoints: 8000,
      maxHealthPoints: 8000,
      currentEnergy: 10,
      maxEnergy: 10,
      deck: [],
      hand: [],
      graveyard: [],
      activeEntities: [createEntity("d-1", defenderCard, "ATTACK")],
      activeExecutions: [],
    },
    activePlayerId: "p1",
    startingPlayerId: "p2",
    turn: 2,
    phase: "BATTLE",
    hasNormalSummonedThisTurn: true,
    combatLog: [],
  };
}
