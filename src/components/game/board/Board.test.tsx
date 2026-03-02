// src/components/game/Board/Board.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Board } from './index';
import { IPlayer } from '@/core/entities/IPlayer';
import { ICard } from '@/core/entities/ICard';

describe('Componente UI: Board y Subcomponentes', () => {
  const mockPlayer: IPlayer = {
    id: 'p1', name: 'Boby Master', healthPoints: 4000, maxHealthPoints: 4000, currentEnergy: 5, maxEnergy: 10, deck: [], hand: [], graveyard: []
  };
  
  const mockOpponent: IPlayer = {
    id: 'p2', name: 'AI Overlord', healthPoints: 3500, maxHealthPoints: 4000, currentEnergy: 8, maxEnergy: 10, deck: [], hand: [], graveyard: []
  };

  const mockEntity: ICard = {
    id: 'c1', name: 'Hack Script', description: 'Ataca fuerte', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 2, attack: 1500, defense: 1000
  };

  it('debería renderizar la información de los jugadores correctamente en el HUD', () => {
    render(<Board 
      player={mockPlayer} opponent={mockOpponent} 
      playerHand={[]} playerActiveEntities={[]} playerActiveExecutions={[]} 
      opponentActiveEntities={[]} opponentActiveExecutions={[]} 
    />);

    expect(screen.getByText('Boby Master')).toBeInTheDocument();
    expect(screen.getByText('AI Overlord')).toBeInTheDocument();
  });

  it('debería abrir el historial de batalla al hacer click en el botón de historial', () => {
    render(<Board 
      player={mockPlayer} opponent={mockOpponent} 
      playerHand={[]} playerActiveEntities={[]} playerActiveExecutions={[]} 
      opponentActiveEntities={[]} opponentActiveExecutions={[]} 
    />);

    // El historial no debería estar visible inicialmente
    expect(screen.queryByText('Log de Batalla')).not.toBeInTheDocument();

    // Hacemos click en el botón
    const historyBtn = screen.getByLabelText('Abrir historial');
    fireEvent.click(historyBtn);

    // Ahora debería estar visible
    expect(screen.getByText('Log de Batalla')).toBeInTheDocument();
  });

  it('debería mostrar los detalles de la carta al hacer click en una carta de la mano', () => {
    render(<Board 
      player={mockPlayer} opponent={mockOpponent} 
      playerHand={[mockEntity]} playerActiveEntities={[]} playerActiveExecutions={[]} 
      opponentActiveEntities={[]} opponentActiveExecutions={[]} 
    />);

    // Como hay dos componentes Card (el de la mano y el del panel cuando se abre),
    // primero hacemos click en el que está en la mano
    const cardTitle = screen.getByText('Hack Script');
    fireEvent.click(cardTitle);

    // Debería aparecer la descripción de la carta en el panel izquierdo
    expect(screen.getByText('Ataca fuerte')).toBeInTheDocument();
  });
});