import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Board } from './index';
import { IPlayer } from '@/core/entities/IPlayer';
import { ICard } from '@/core/entities/ICard';

// Mocks actualizados a la nueva interfaz ICard
const mockHand: ICard[] = [
  { id: 'c1', name: 'Firewall', description: '', type: 'ENTITY', faction: 'NEUTRAL', cost: 1, attack: 10, defense: 10 }
];

// Mocks actualizados a la nueva interfaz IPlayer (incorporando deck, hand, graveyard)
const mockPlayer: IPlayer = {
  id: 'p1', 
  name: 'Neo', 
  healthPoints: 8000, 
  maxHealthPoints: 8000,
  currentEnergy: 5, 
  maxEnergy: 10, 
  deck: ['c2', 'c3'],
  hand: mockHand,
  graveyard: []
};

const mockOpponent: IPlayer = {
  id: 'p2', 
  name: 'Agent Smith', 
  healthPoints: 8000, 
  maxHealthPoints: 8000,
  currentEnergy: 4, 
  maxEnergy: 10, 
  deck: ['c4', 'c5'],
  hand: [],
  graveyard: ['c6']
};

describe('Board Component', () => {
  it('Debe renderizar los HUDs de los jugadores correctamente', () => {
    render(
      <Board 
        player={mockPlayer} 
        opponent={mockOpponent} 
        playerHand={mockHand} 
        playerActiveEntities={[]} playerActiveExecutions={[]} 
        opponentActiveEntities={[]} opponentActiveExecutions={[]} 
      />
    );

    expect(screen.getByText('Neo')).toBeDefined();
    expect(screen.getByText('Agent Smith')).toBeDefined();
  });

  it('Debe renderizar la carta en la mano del jugador', () => {
    render(
      <Board 
        player={mockPlayer} opponent={mockOpponent} playerHand={mockHand} 
        playerActiveEntities={[]} playerActiveExecutions={[]} 
        opponentActiveEntities={[]} opponentActiveExecutions={[]} 
      />
    );

    expect(screen.getByText('Firewall')).toBeDefined();
  });
});