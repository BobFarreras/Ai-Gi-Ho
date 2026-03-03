import { IBoardEntity, IPlayer } from "@/core/entities/IPlayer";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { CombatContext, CombatService } from "@/core/use-cases/CombatService";
import { assignPlayers } from "@/core/use-cases/game-engine/state/player-utils";
import { GameState } from "@/core/use-cases/game-engine/state/types";
import { markAttackerAsUsed } from "@/core/use-cases/game-engine/combat/internal/attack-entities";
import { validateDirectAttack } from "@/core/use-cases/game-engine/combat/internal/attack-validation";

interface IResolveDirectAttackParams {
  state: GameState;
  attacker: IPlayer;
  defender: IPlayer;
  attackerEntity: IBoardEntity;
  attackerInstanceId: string;
  isPlayerA: boolean;
}

export function resolveDirectAttackState(params: IResolveDirectAttackParams): { state: GameState; damage: number } {
  const { state, attacker, defender, attackerEntity, attackerInstanceId, isPlayerA } = params;
  validateDirectAttack(defender.activeEntities.length > 0);
  const damage = attackerEntity.card.attack ?? 0;
  const updatedAttacker: IPlayer = {
    ...attacker,
    activeEntities: markAttackerAsUsed(attacker.activeEntities, attackerInstanceId),
  };
  const updatedDefender: IPlayer = {
    ...defender,
    healthPoints: Math.max(0, defender.healthPoints - damage),
  };
  return { state: assignPlayers(state, updatedAttacker, updatedDefender, isPlayerA), damage };
}

interface IResolveEntityBattleParams {
  state: GameState;
  attacker: IPlayer;
  defender: IPlayer;
  attackerEntity: IBoardEntity;
  defenderInstanceId: string;
  attackerInstanceId: string;
  isPlayerA: boolean;
}

export function resolveEntityBattleState(params: IResolveEntityBattleParams): { state: GameState; result: ReturnType<typeof CombatService.calculateBattle>; defenderEntity: IBoardEntity } {
  const { state, attacker, defender, attackerEntity, defenderInstanceId, attackerInstanceId, isPlayerA } = params;
  const defenderEntity = defender.activeEntities.find((entity) => entity.instanceId === defenderInstanceId);
  if (!defenderEntity) {
    throw new NotFoundError("La carta defensora no está en el campo");
  }

  const isDefenderInDefenseMode = defenderEntity.mode === "DEFENSE" || defenderEntity.mode === "SET";
  const defenderStat = isDefenderInDefenseMode ? (defenderEntity.card.defense ?? 0) : (defenderEntity.card.attack ?? 0);
  const context: CombatContext = {
    attackerAtk: attackerEntity.card.attack ?? 0,
    defenderStat,
    isDefenderInDefenseMode,
  };
  const result = CombatService.calculateBattle(context);
  const updatedAttacker = buildUpdatedAttacker(attacker, attackerEntity, attackerInstanceId, result.attackerDestroyed, result.damageToAttackerPlayer);
  const updatedDefender = buildUpdatedDefender(defender, defenderEntity, defenderInstanceId, result.defenderDestroyed, result.damageToDefenderPlayer);
  return { state: assignPlayers(state, updatedAttacker, updatedDefender, isPlayerA), result, defenderEntity };
}

function buildUpdatedAttacker(
  attacker: IPlayer,
  attackerEntity: IBoardEntity,
  attackerInstanceId: string,
  attackerDestroyed: boolean,
  damageToAttackerPlayer: number,
): IPlayer {
  let updatedEntities = markAttackerAsUsed(attacker.activeEntities, attackerInstanceId);
  let updatedGraveyard = attacker.graveyard;
  if (attackerDestroyed) {
    updatedEntities = updatedEntities.filter((entity) => entity.instanceId !== attackerInstanceId);
    updatedGraveyard = [...updatedGraveyard, attackerEntity.card];
  }
  return {
    ...attacker,
    healthPoints: Math.max(0, attacker.healthPoints - damageToAttackerPlayer),
    activeEntities: updatedEntities,
    graveyard: updatedGraveyard,
  };
}

function buildUpdatedDefender(
  defender: IPlayer,
  defenderEntity: IBoardEntity,
  defenderInstanceId: string,
  defenderDestroyed: boolean,
  damageToDefenderPlayer: number,
): IPlayer {
  let updatedEntities = defender.activeEntities;
  let updatedGraveyard = defender.graveyard;
  if (defenderDestroyed) {
    updatedEntities = updatedEntities.filter((entity) => entity.instanceId !== defenderInstanceId);
    updatedGraveyard = [...updatedGraveyard, defenderEntity.card];
  } else if (defenderEntity.mode === "SET") {
    updatedEntities = updatedEntities.map((entity) =>
      entity.instanceId === defenderInstanceId ? { ...entity, mode: "DEFENSE" } : entity,
    );
  }
  return {
    ...defender,
    healthPoints: Math.max(0, defender.healthPoints - damageToDefenderPlayer),
    activeEntities: updatedEntities,
    graveyard: updatedGraveyard,
  };
}
