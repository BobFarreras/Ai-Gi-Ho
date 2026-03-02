// src/components/game/board/hooks/useBoard.ts
import { useState, useCallback } from "react";
import { ICard } from "@/core/entities/ICard";
import { GameState, GameEngine } from "@/core/use-cases/GameEngine";
import { BattleMode, IBoardEntity } from "@/core/entities/IPlayer";

// --- MOCKS INICIALES: IDs completamente únicos asegurados ---
const mockHandA: ICard[] = [
  { id: 'card-p1-gemini', name: 'Gemini 1.5', type: 'ENTITY', faction: 'BIG_TECH', cost: 3, attack: 2500, defense: 2000, description: 'LLM Multimodal.' },
  { id: 'card-p1-ollama', name: 'Ollama Local', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 2, attack: 1500, defense: 2800, description: 'Privacidad absoluta.' },
];

const mockHandB: ICard[] = [
  { id: 'card-p2-llama3', name: 'Llama 3', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 3, attack: 2200, defense: 2000, description: 'Open weights.' },
];

const mockOpponentEntityStrong: IBoardEntity = {
  instanceId: 'inst-gpt4-boss-001',
  card: { id: 'card-p2-gpt4', name: 'GPT-4', type: 'ENTITY', faction: 'BIG_TECH', cost: 4, attack: 3000, defense: 2500, description: 'Top tier LLM.' },
  mode: 'ATTACK',
  hasAttackedThisTurn: false,
  isNewlySummoned: false
};

const mockOpponentEntityWeak: IBoardEntity = {
  instanceId: 'inst-weak-bug-002',
  card: { id: 'card-p2-bug', name: 'Bug de Producción', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 1, attack: 1000, defense: 500, description: 'Fácil de aplastar.' },
  mode: 'ATTACK',
  hasAttackedThisTurn: false,
  isNewlySummoned: false
};

const generateDeck = (prefix: string) => Array.from({ length: 17 }).map((_, i) => `${prefix}-deck-${i}`);

const initialGameState: GameState = {
  playerA: { id: 'p1', name: 'Neo (Tú)', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p1'), hand: mockHandA, graveyard: [], activeEntities: [], activeExecutions: [] },
  playerB: { id: 'p2', name: 'Agente Smith', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p2'), hand: mockHandB, graveyard: [], activeEntities: [mockOpponentEntityStrong, mockOpponentEntityWeak], activeExecutions: [] },
  activePlayerId: 'p1',
  turn: 1,
  phase: 'MAIN_1',
  hasNormalSummonedThisTurn: false
};

// --- HOOK PRINCIPAL ---
export function useBoard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [playingCard, setPlayingCard] = useState<ICard | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeAttackerId, setActiveAttackerId] = useState<string | null>(null);

  const clearSelection = useCallback(() => {
    setSelectedCard(null);
    setPlayingCard(null);
    setIsHistoryOpen(false);
    setActiveAttackerId(null);
  }, []);

  const advancePhase = useCallback(() => {
    setGameState((prev) => GameEngine.nextPhase(prev));
    clearSelection();
  }, [clearSelection]);

  const toggleCardSelection = (card: ICard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingCard?.id === card.id) {
      clearSelection();
    } else {
      setSelectedCard(card);
      setPlayingCard(card);
      setActiveAttackerId(null);
    }
  };

  const executePlayAction = (mode: BattleMode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playingCard) return;

    setGameState((prev) => {
      try {
        return GameEngine.playEntityCard(prev, prev.playerA.id, playingCard.id, mode);
      } catch (error: unknown) {
        if (error instanceof Error) console.error(`[SYS ERROR] ${error.message}`);
        return prev;
      }
    });
    clearSelection();
  };

  const handleEntityClick = (entity: IBoardEntity | null, isOpponent: boolean, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isOpponent) {
      if (!entity) return; 
      
      if (gameState.phase !== 'BATTLE') {
        setSelectedCard(entity.card); 
        return;
      }

      if (entity.mode !== 'ATTACK' || entity.hasAttackedThisTurn) return;

      setActiveAttackerId(prev => prev === entity.instanceId ? null : entity.instanceId);
      setSelectedCard(entity.card);
      setPlayingCard(null);

    } else {
      if (activeAttackerId) {
        setGameState((prev) => {
          try {
            return GameEngine.executeAttack(prev, prev.playerA.id, activeAttackerId, entity?.instanceId);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(`[COMBAT ERROR] ${error.message}`);
            return prev;
          }
        });
        setActiveAttackerId(null); 
      } else if (entity) {
        setSelectedCard(entity.card); 
      }
    }
  };

  return {
    gameState, selectedCard, playingCard, isHistoryOpen, activeAttackerId,
    setIsHistoryOpen, toggleCardSelection, clearSelection, executePlayAction, handleEntityClick, advancePhase
  };
}