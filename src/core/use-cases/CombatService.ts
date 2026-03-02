import { ICard } from '../entities/ICard';
import { IPlayer } from '../entities/IPlayer';

export interface ICombatResult {
  readonly newHealthPoints: number;
  readonly isDefenderDestroyed: boolean;
}

/**
 * Resuelve las reglas de negocio de un combate entre dos cartas.
 */
export function resolveCombat(
  attacker: ICard, 
  defender: ICard, 
  defendingPlayer: IPlayer
): ICombatResult {
  const attackPower = attacker.attack ?? 0;
  const defensePower = defender.defense ?? 0;

  if (attackPower > defensePower) {
    const damage = attackPower - defensePower;
    // Aseguramos que la vida no baje de 0 (regla de negocio no escrita, pero vital)
    const finalHealth = Math.max(0, defendingPlayer.healthPoints - damage);
    
    return {
      newHealthPoints: finalHealth,
      isDefenderDestroyed: true,
    };
  }

  return {
    newHealthPoints: defendingPlayer.healthPoints,
    isDefenderDestroyed: false,
  };
}