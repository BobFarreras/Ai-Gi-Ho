import { CombatContext, CombatService } from "../CombatService";
import { IBoardEntity, IPlayer } from "../../entities/IPlayer";
import { assignPlayers, getPlayerPair } from "./player-utils";
import { GameState } from "./types";

function markAttackerAsUsed(entities: IBoardEntity[], attackerInstanceId: string): IBoardEntity[] {
  return entities.map((entity) =>
    entity.instanceId === attackerInstanceId ? { ...entity, hasAttackedThisTurn: true } : entity,
  );
}

export function executeAttack(
  state: GameState,
  attackerPlayerId: string,
  attackerInstanceId: string,
  defenderInstanceId?: string,
): GameState {
  const { player: attacker, opponent: defender, isPlayerA } = getPlayerPair(state, attackerPlayerId);

  const attackerEntity = attacker.activeEntities.find((entity) => entity.instanceId === attackerInstanceId);

  if (!attackerEntity) {
    throw new Error("La carta atacante no está en el campo");
  }

  if (attackerEntity.mode !== "ATTACK") {
    throw new Error("Solo las cartas en modo ATAQUE pueden atacar");
  }

  if (attackerEntity.hasAttackedThisTurn) {
    throw new Error("Esta carta ya ha atacado este turno");
  }

  if (!defenderInstanceId) {
    if (defender.activeEntities.length > 0) {
      throw new Error("No puedes atacar directamente si el oponente tiene entidades en el campo.");
    }

    const damage = attackerEntity.card.attack ?? 0;
    const updatedAttacker: IPlayer = {
      ...attacker,
      activeEntities: markAttackerAsUsed(attacker.activeEntities, attackerInstanceId),
    };
    const updatedDefender: IPlayer = {
      ...defender,
      healthPoints: Math.max(0, defender.healthPoints - damage),
    };

    return assignPlayers(state, updatedAttacker, updatedDefender, isPlayerA);
  }

  const defenderEntity = defender.activeEntities.find((entity) => entity.instanceId === defenderInstanceId);

  if (!defenderEntity) {
    throw new Error("La carta defensora no está en el campo");
  }

  const isDefenderInDefenseMode = defenderEntity.mode === "DEFENSE" || defenderEntity.mode === "SET";
  const defenderStat = isDefenderInDefenseMode
    ? (defenderEntity.card.defense ?? 0)
    : (defenderEntity.card.attack ?? 0);

  const context: CombatContext = {
    attackerAtk: attackerEntity.card.attack ?? 0,
    defenderStat,
    isDefenderInDefenseMode,
  };
  const result = CombatService.calculateBattle(context);

  let updatedAttackerEntities = markAttackerAsUsed(attacker.activeEntities, attackerInstanceId);
  let updatedAttackerGraveyard = attacker.graveyard;

  if (result.attackerDestroyed) {
    updatedAttackerEntities = updatedAttackerEntities.filter((entity) => entity.instanceId !== attackerInstanceId);
    updatedAttackerGraveyard = [...updatedAttackerGraveyard, attackerEntity.card];
  }

  let updatedDefenderEntities = defender.activeEntities;
  let updatedDefenderGraveyard = defender.graveyard;

  if (result.defenderDestroyed) {
    updatedDefenderEntities = updatedDefenderEntities.filter((entity) => entity.instanceId !== defenderInstanceId);
    updatedDefenderGraveyard = [...updatedDefenderGraveyard, defenderEntity.card];
  } else if (defenderEntity.mode === "SET") {
    updatedDefenderEntities = updatedDefenderEntities.map((entity) =>
      entity.instanceId === defenderInstanceId ? { ...entity, mode: "DEFENSE" } : entity,
    );
  }

  const updatedAttacker: IPlayer = {
    ...attacker,
    healthPoints: Math.max(0, attacker.healthPoints - result.damageToAttackerPlayer),
    activeEntities: updatedAttackerEntities,
    graveyard: updatedAttackerGraveyard,
  };

  const updatedDefender: IPlayer = {
    ...defender,
    healthPoints: Math.max(0, defender.healthPoints - result.damageToDefenderPlayer),
    activeEntities: updatedDefenderEntities,
    graveyard: updatedDefenderGraveyard,
  };

  return assignPlayers(state, updatedAttacker, updatedDefender, isPlayerA);
}
