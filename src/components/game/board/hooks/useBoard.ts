import { useState } from "react";
import { ICard } from "@/core/entities/ICard";
import { GameState, GameEngine } from "@/core/use-cases/GameEngine";
import { BattleMode, IBoardEntity } from "@/core/entities/IPlayer";

const mockHandA: ICard[] = [
  { id: 'c1', name: 'Gemini 1.5', type: 'ENTITY', faction: 'BIG_TECH', cost: 3, attack: 2500, defense: 2000, description: 'LLM Multimodal.' },
  { id: 'c2', name: 'Ollama Local', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 2, attack: 1500, defense: 2800, description: 'Privacidad absoluta.' },
];

const mockHandB: ICard[] = [
  { id: 'op2', name: 'Llama 3', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 3, attack: 2200, defense: 2000, description: 'Open weights.' },
];

// MOCK: Carta enemiga ya colocada en el tablero
const mockOpponentEntity: IBoardEntity = {
  instanceId: 'inst-gpt4-boss',
  card: { id: 'op1', name: 'GPT-4', type: 'ENTITY', faction: 'BIG_TECH', cost: 4, attack: 3000, defense: 2500, description: 'Top tier LLM.' },
  mode: 'ATTACK',
  hasAttackedThisTurn: false,
  isNewlySummoned: false
};

const generateDeck = (prefix: string) => Array.from({ length: 17 }).map((_, i) => `${prefix}-deck-${i}`);

const initialGameState: GameState = {
  playerA: { id: 'p1', name: 'Neo (Tú)', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p1'), hand: mockHandA, graveyard: [], activeEntities: [], activeExecutions: [] },
  playerB: { id: 'p2', name: 'Agente Smith', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p2'), hand: mockHandB, graveyard: [], activeEntities: [mockOpponentEntity], activeExecutions: [] },
  activePlayerId: 'p1',
  turn: 1,
  phase: 'MAIN_1', // <--- CAMBIAR ESTO DE VUELTA A MAIN_1
  hasNormalSummonedThisTurn: false
};

export function useBoard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [playingCard, setPlayingCard] = useState<ICard | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // SISTEMA DE APUNTADO
  const [activeAttackerId, setActiveAttackerId] = useState<string | null>(null);

  const toggleCardSelection = (card: ICard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingCard?.id === card.id) {
      clearSelection();
    } else {
      setSelectedCard(card);
      setPlayingCard(card);
      setActiveAttackerId(null); // Cancelamos ataques si volvemos a la mano
    }
  };

  const clearSelection = () => {
    setSelectedCard(null);
    setPlayingCard(null);
    setIsHistoryOpen(false);
    setActiveAttackerId(null);
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

  // SISTEMA DE COMBATE (Lógica al hacer click en el tablero)
  const handleEntityClick = (entity: IBoardEntity, isOpponent: boolean, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isOpponent) {
      // 1. CLICK EN MI CARTA: La preparamos para atacar
      if (entity.mode !== 'ATTACK') {
        console.warn("[SYS] Solo las cartas en modo ATAQUE pueden atacar.");
        return;
      }
      if (entity.hasAttackedThisTurn) {
        console.warn("[SYS] Esta carta ya ha atacado este turno.");
        return;
      }

      setActiveAttackerId(prev => prev === entity.instanceId ? null : entity.instanceId);
      setSelectedCard(entity.card);
      setPlayingCard(null);

    } else {
      // 2. CLICK EN CARTA ENEMIGA
      if (activeAttackerId) {
        setGameState((prev) => {
          try {
            console.log(`[COMBAT] Atacando a ${entity.card.name}!`);
            return GameEngine.executeAttack(prev, prev.playerA.id, activeAttackerId, entity.instanceId);
          } catch (error: unknown) {
            if (error instanceof Error) console.error(`[COMBAT ERROR] ${error.message}`);
            return prev;
          }
        });

        setActiveAttackerId(null); // Limpiamos la mira después de atacar
      } else {
        setSelectedCard(entity.card); // Solo inspeccionar
      }
    }
  };// 2. DENTRO DE useBoard(), AÑADE ESTA FUNCIÓN:
  const advancePhase = () => {
    setGameState((prev) => {
      clearSelection(); // Limpiamos selecciones al cambiar de fase
      return GameEngine.nextPhase(prev);
    });
  };

  return {
    gameState, selectedCard, playingCard, isHistoryOpen, activeAttackerId,
    setIsHistoryOpen, toggleCardSelection, clearSelection, executePlayAction, handleEntityClick,
    advancePhase // <--- AÑADIR AQUÍ
  };
}