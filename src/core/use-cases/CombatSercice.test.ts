import { describe, it, expect } from 'vitest';
import { resolveCombat } from './CombatService';
import { ICard } from '../entities/ICard';
import { IPlayer } from '../entities/IPlayer';

describe('CombatService (Domain Logic)', () => {
  it('debería restar puntos de vida y destruir al defensor si el ataque es mayor', () => {
    // Arrange
    const attacker: ICard = {
      id: 'c1', 
      name: 'Gemini 1.5 Pro', 
      description: 'Modelo fundacional superinteligente.', 
      type: 'ENTITY', 
      attack: 2500, 
      defense: 2000, 
      faction: 'BIG_TECH', 
      cost: 7 
    };
    
    const defender: ICard = {
      id: 'c2', 
      name: 'Script Antiguo', 
      description: 'Un bot que se rompe con un cambio de div.', 
      type: 'ENTITY', 
      attack: 1000, 
      defense: 1500, 
      faction: 'OPEN_SOURCE', 
      cost: 2 
    };
    
    const player: IPlayer = { 
      id: 'p1', 
      name: 'Rival', 
      healthPoints: 4000, 
      maxHealthPoints: 4000,
      currentEnergy: 10,
      maxEnergy: 10,
      deck: [],         // Array vacío de referencias
      hand: [],         // Array vacío de cartas físicas
      graveyard: []     // Array vacío de referencias
    };

    // Act
    const result = resolveCombat(attacker, defender, player);

    // Assert
    expect(result.newHealthPoints).toBe(3000); // 4000 - (2500 - 1500)
    expect(result.isDefenderDestroyed).toBe(true);
  });

  it('no debería restar vida y el defensor sobrevive si el ataque es menor o igual a la defensa', () => {
    // Arrange
    const attacker: ICard = {
      id: 'c3', 
      name: 'Bot Pequeño', 
      description: 'Automatización básica.', 
      type: 'ENTITY', 
      attack: 1000, 
      defense: 1000,
      faction: 'NO_CODE',
      cost: 1
    };
    
    const defender: ICard = {
      id: 'c4', 
      name: 'Firewall', 
      description: 'Bloquea peticiones no deseadas.', 
      type: 'ENVIRONMENT', // Cambiado a ENVIRONMENT para dar variedad
      attack: 0, 
      defense: 2000,
      faction: 'NEUTRAL',
      cost: 3
    };
    
    const player: IPlayer = { 
      id: 'p1', 
      name: 'Rival', 
      healthPoints: 4000,
      maxHealthPoints: 4000,
      currentEnergy: 10,
      maxEnergy: 10,
      deck: [],
      hand: [],
      graveyard: [] 
    };

    // Act
    const result = resolveCombat(attacker, defender, player);

    // Assert
    expect(result.newHealthPoints).toBe(4000);
    expect(result.isDefenderDestroyed).toBe(false);
  });
});