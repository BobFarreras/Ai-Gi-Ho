// src/core/use-cases/GameEngine.ts
import { IPlayer, IBoardEntity, BattleMode } from "../entities/IPlayer";
import { CombatService, CombatContext } from "./CombatService";

export interface GameState {
  playerA: IPlayer;
  playerB: IPlayer;
  activePlayerId: string;
  turn: number;
  phase: 'DRAW' | 'MAIN_1' | 'BATTLE' | 'MAIN_2' | 'END';
  hasNormalSummonedThisTurn: boolean;
}

export class GameEngine {
  
  public static playEntityCard(state: GameState, playerId: string, cardId: string, mode: BattleMode): GameState {
    if (state.activePlayerId !== playerId) throw new Error("No es tu turno.");
    if (state.phase !== 'MAIN_1' && state.phase !== 'MAIN_2') throw new Error("Solo puedes invocar en la Main Phase.");
    if (state.hasNormalSummonedThisTurn) throw new Error("Ya has invocado una entidad este turno.");

    const isPlayerA = state.playerA.id === playerId;
    const player = isPlayerA ? state.playerA : state.playerB;

    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) throw new Error("La carta no está en la mano.");
    
    const card = player.hand[cardIndex];
    if (player.currentEnergy < card.cost) throw new Error("Energía insuficiente.");
    if (player.activeEntities.length >= 5) throw new Error("Tu zona de entidades está llena.");

    const boardEntity: IBoardEntity = {
      instanceId: `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      card: card,
      mode: mode,
      hasAttackedThisTurn: false,
      isNewlySummoned: true
    };

    const newPlayer: IPlayer = {
      ...player,
      currentEnergy: player.currentEnergy - card.cost,
      hand: player.hand.filter((_, idx) => idx !== cardIndex),
      activeEntities: [...player.activeEntities, boardEntity]
    };

    return {
      ...state,
      hasNormalSummonedThisTurn: true,
      playerA: isPlayerA ? newPlayer : state.playerA,
      playerB: isPlayerA ? state.playerB : newPlayer
    };
  }

  public static executeAttack(
    state: GameState, 
    attackerPlayerId: string, 
    attackerInstanceId: string, 
    defenderInstanceId?: string 
  ): GameState {
    const isAttackerA = state.playerA.id === attackerPlayerId;
    const attacker = isAttackerA ? state.playerA : state.playerB;
    const defender = isAttackerA ? state.playerB : state.playerA;

    const attackerEntity = attacker.activeEntities.find(c => c.instanceId === attackerInstanceId);
    if (!attackerEntity) throw new Error("La carta atacante no está en el campo");
    if (attackerEntity.mode !== 'ATTACK') throw new Error("Solo las cartas en modo ATAQUE pueden atacar");
    if (attackerEntity.hasAttackedThisTurn) throw new Error("Esta carta ya ha atacado este turno");

    // ATAQUE DIRECTO
    if (!defenderInstanceId) {
      if (defender.activeEntities.length > 0) {
        throw new Error("No puedes atacar directamente si el oponente tiene entidades en el campo.");
      }
      const damage = attackerEntity.card.attack ?? 0;
      const newAttackerEntities = attacker.activeEntities.map(c => 
        c.instanceId === attackerInstanceId ? { ...c, hasAttackedThisTurn: true } : c
      );
      return {
        ...state,
        playerA: isAttackerA 
          ? { ...attacker, activeEntities: newAttackerEntities } 
          : { ...defender, healthPoints: Math.max(0, defender.healthPoints - damage) },
        playerB: isAttackerA 
          ? { ...defender, healthPoints: Math.max(0, defender.healthPoints - damage) } 
          : { ...attacker, activeEntities: newAttackerEntities }
      };
    }

    // ATAQUE A ENTIDAD
    const defenderEntity = defender.activeEntities.find(c => c.instanceId === defenderInstanceId);
    if (!defenderEntity) throw new Error("La carta defensora no está en el campo");

    const isDefenderInDefense = defenderEntity.mode === 'DEFENSE' || defenderEntity.mode === 'SET';
    const defenderStat = isDefenderInDefense 
      ? (defenderEntity.card.defense ?? 0) 
      : (defenderEntity.card.attack ?? 0);

    const ctx: CombatContext = {
      attackerAtk: attackerEntity.card.attack ?? 0,
      defenderStat: defenderStat,
      isDefenderInDefenseMode: isDefenderInDefense 
    };

    const result = CombatService.calculateBattle(ctx);

    // Procesar Atacante
    let newAttackerEntities = attacker.activeEntities.map(c => 
      c.instanceId === attackerInstanceId ? { ...c, hasAttackedThisTurn: true } : c
    );
    let newAttackerGraveyard = attacker.graveyard;
    
    if (result.attackerDestroyed) {
      newAttackerEntities = newAttackerEntities.filter(c => c.instanceId !== attackerInstanceId);
      newAttackerGraveyard = [...newAttackerGraveyard, attackerEntity.card]; // SE GUARDA LA CARTA
    }

    const newAttacker: IPlayer = {
      ...attacker,
      healthPoints: Math.max(0, attacker.healthPoints - result.damageToAttackerPlayer),
      activeEntities: newAttackerEntities,
      graveyard: newAttackerGraveyard
    };

    // Procesar Defensor
    let newDefenderEntities = defender.activeEntities;
    let newDefenderGraveyard = defender.graveyard;

    if (result.defenderDestroyed) {
      newDefenderEntities = newDefenderEntities.filter(c => c.instanceId !== defenderInstanceId);
      newDefenderGraveyard = [...newDefenderGraveyard, defenderEntity.card]; // SE GUARDA LA CARTA
    } else if (defenderEntity.mode === 'SET') {
      newDefenderEntities = newDefenderEntities.map(c => 
        c.instanceId === defenderInstanceId ? { ...c, mode: 'DEFENSE' } : c
      );
    }

    const newDefender: IPlayer = {
      ...defender,
      healthPoints: Math.max(0, defender.healthPoints - result.damageToDefenderPlayer),
      activeEntities: newDefenderEntities,
      graveyard: newDefenderGraveyard
    };

    return {
      ...state,
      playerA: isAttackerA ? newAttacker : newDefender,
      playerB: isAttackerA ? newDefender : newAttacker
    };
  }

  public static nextPhase(state: GameState): GameState {
    const phases: Array<'DRAW' | 'MAIN_1' | 'BATTLE' | 'MAIN_2' | 'END'> = ['DRAW', 'MAIN_1', 'BATTLE', 'MAIN_2', 'END'];
    const currentIndex = phases.indexOf(state.phase);

    if (state.phase === 'END') {
      const nextActivePlayerId = state.activePlayerId === state.playerA.id ? state.playerB.id : state.playerA.id;
      const resetEntities = (entities: IBoardEntity[]) => entities.map(e => ({ ...e, hasAttackedThisTurn: false, isNewlySummoned: false }));

      return {
        ...state,
        turn: state.turn + 1,
        phase: 'DRAW',
        activePlayerId: nextActivePlayerId,
        hasNormalSummonedThisTurn: false,
        playerA: { ...state.playerA, currentEnergy: state.playerA.maxEnergy, activeEntities: resetEntities(state.playerA.activeEntities) },
        playerB: { ...state.playerB, currentEnergy: state.playerB.maxEnergy, activeEntities: resetEntities(state.playerB.activeEntities) }
      };
    }
    return { ...state, phase: phases[currentIndex + 1] };
  }
}