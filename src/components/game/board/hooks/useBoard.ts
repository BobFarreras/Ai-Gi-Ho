// src/components/game/board/hooks/useBoard.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { ICard } from "@/core/entities/ICard";
import { GameState, GameEngine } from "@/core/use-cases/GameEngine";
import { BattleMode, IBoardEntity } from "@/core/entities/IPlayer";
import { AppError } from "@/core/errors/AppError";
import { isAppError } from "@/core/errors/isAppError";

// --- MOCKS INICIALES ---
const mockHandA: ICard[] = [
  { id: 'card-p1-gemini', name: 'Gemini 1.5', type: 'ENTITY', faction: 'BIG_TECH', cost: 3, attack: 2500, defense: 2000, description: 'LLM Multimodal.', bgUrl: '/assets/bgs/bg-tech.jpg', renderUrl: '/assets/renders/gemini.png' },
  { id: 'card-spell-ddos', name: 'DDoS Attack', type: 'EXECUTION', faction: 'NO_CODE', cost: 2, description: 'Drena 1000 LP al rival.', bgUrl: '/assets/bgs/bg-tech.jpg', renderUrl: '/assets/renders/n8n.png', effect: { action: 'DAMAGE', target: 'OPPONENT', value: 1000 } },
];
const mockHandB: ICard[] = [{ id: 'op2', name: 'Llama 3', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 3, attack: 2200, defense: 2000, description: 'Open weights.', bgUrl: '/assets/bgs/bg-tech.jpg', renderUrl: '/assets/renders/make.png' }];
const mockOpponentEntityStrong: IBoardEntity = { instanceId: 'inst-gpt4-boss-001', card: { id: 'op1', name: 'GPT-4', type: 'ENTITY', faction: 'BIG_TECH', cost: 4, attack: 3000, defense: 2500, description: 'Top tier LLM.', bgUrl: '/assets/bgs/bg-tech.jpg', renderUrl: '/assets/renders/chatgpt.png' }, mode: 'ATTACK', hasAttackedThisTurn: false, isNewlySummoned: false };
const mockOpponentEntityWeak: IBoardEntity = { instanceId: 'inst-weak-bug-002', card: { id: 'op-weak', name: 'OpenClaw', type: 'ENTITY', faction: 'OPEN_SOURCE', cost: 1, attack: 1000, defense: 500, description: 'Fácil de aplastar.', bgUrl: '/assets/bgs/bg-tech.jpg', renderUrl: '/assets/renders/openclaw.png' }, mode: 'DEFENSE', hasAttackedThisTurn: false, isNewlySummoned: false };
const generateDeck = (prefix: string) => Array.from({ length: 17 }).map((_, i) => `${prefix}-deck-${i}`);

const initialGameState: GameState = {
  playerA: { id: 'p1', name: 'Neo (Tú)', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p1'), hand: mockHandA, graveyard: [], activeEntities: [], activeExecutions: [] },
  playerB: { id: 'p2', name: 'Agente Smith', healthPoints: 8000, maxHealthPoints: 8000, currentEnergy: 10, maxEnergy: 10, deck: generateDeck('p2'), hand: mockHandB, graveyard: [], activeEntities: [mockOpponentEntityStrong, mockOpponentEntityWeak], activeExecutions: [] },
  activePlayerId: 'p1', turn: 1, phase: 'MAIN_1', hasNormalSummonedThisTurn: false
};

// Utilidad para pausar la ejecución y dejar que Framer Motion anime
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface IBoardUiError {
  code: AppError["code"];
  message: string;
}

function toBoardUiError(error: unknown): IBoardUiError {
  if (isAppError(error)) {
    return { code: error.code, message: error.message };
  }

  return { code: "GAME_RULE_ERROR", message: "Ha ocurrido un error inesperado en el tablero." };
}

export function useBoard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [playingCard, setPlayingCard] = useState<ICard | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeAttackerId, setActiveAttackerId] = useState<string | null>(null);
  
  // NUEVOS ESTADOS DE ANIMACIÓN COREOGRÁFICA
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedEntities, setRevealedEntities] = useState<string[]>([]); // Cartas que se voltean temporalmente al ser atacadas
  const [lastError, setLastError] = useState<IBoardUiError | null>(null);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const applyTransition = useCallback((transition: (state: GameState) => GameState): GameState | null => {
    try {
      const nextState = transition(gameStateRef.current);
      gameStateRef.current = nextState;
      setGameState(nextState);
      return nextState;
    } catch (error: unknown) {
      setLastError(toBoardUiError(error));
      return null;
    }
  }, []);

  const clearSelection = useCallback(() => { 
    setSelectedCard(null); setPlayingCard(null); setIsHistoryOpen(false); setActiveAttackerId(null); 
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  useEffect(() => {
    if (!lastError) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setLastError(null);
    }, 3600);

    return () => clearTimeout(timeoutId);
  }, [lastError]);

  const assertPlayerTurn = useCallback((): boolean => {
    if (gameStateRef.current.activePlayerId !== gameStateRef.current.playerA.id) {
      setLastError({ code: "GAME_RULE_ERROR", message: "No es tu turno. Espera a que el rival termine su fase." });
      return false;
    }

    return true;
  }, []);
  
  const advancePhase = useCallback(() => { 
    if (isAnimating) return;
    if (!assertPlayerTurn()) return;
    const nextState = applyTransition((state) => GameEngine.nextPhase(state));
    if (!nextState) return;
    clearSelection();
    clearError();
  }, [applyTransition, assertPlayerTurn, clearSelection, clearError, isAnimating]);

  const toggleCardSelection = (card: ICard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAnimating) return;
    if (!assertPlayerTurn()) return;
    if (playingCard?.id === card.id) clearSelection();
    else { setSelectedCard(card); setPlayingCard(card); setActiveAttackerId(null); }
    clearError();
  };

  const executePlayAction = async (mode: BattleMode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playingCard || isAnimating) return;
    if (!assertPlayerTurn()) return;
    clearError();

    // SI JUGAMOS UNA MAGIA DIRECTAMENTE PARA ACTIVARLA
    if (mode === 'ACTIVATE') {
      setIsAnimating(true);
      const playedState = applyTransition((state) => GameEngine.playCard(state, state.playerA.id, playingCard.id, mode));
      if (!playedState) {
        setIsAnimating(false);
        return;
      }
      const execInstanceId = playedState.playerA.activeExecutions[playedState.playerA.activeExecutions.length - 1]?.instanceId;
      if (!execInstanceId) {
        setLastError({ code: "NOT_FOUND_ERROR", message: "No se pudo localizar la ejecución recién activada." });
        setIsAnimating(false);
        return;
      }
      try {
        clearSelection();
        
        // Esperamos que la carta caiga y dispare el láser VFX
        await sleep(1500); 
        
        // Resolvemos y la mandamos al cementerio
        applyTransition((state) => GameEngine.resolveExecution(state, state.playerA.id, execInstanceId));
      } finally {
        setIsAnimating(false);
      }
    } else {
      const playedState = applyTransition((state) => GameEngine.playCard(state, state.playerA.id, playingCard.id, mode));
      if (playedState) {
        clearSelection();
      }
    }
  };

  const handleEntityClick = async (entity: IBoardEntity | null, isOpponent: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating) return; // Bloquear si hay cinemática
    if (!assertPlayerTurn()) return;
    clearError();

    if (!isOpponent) {
      if (!entity) return; 

      // ACTIVAR UNA MAGIA QUE ESTABA BOCA ABAJO (SET)
      if (entity.card.type === 'EXECUTION' && entity.mode === 'SET') {
        setIsAnimating(true);
        const activatedState = applyTransition((state) => GameEngine.changeEntityMode(state, state.playerA.id, entity.instanceId, 'ACTIVATE'));
        if (!activatedState) {
          setIsAnimating(false);
          return;
        }
        clearSelection();
        // 2. Cinemática de láser
        await sleep(1500);
        // 3. Resolución final
        applyTransition((state) => GameEngine.resolveExecution(state, state.playerA.id, entity.instanceId));
        setIsAnimating(false);
        return;
      }
      
      if (gameState.phase !== 'BATTLE') { setSelectedCard(entity.card); return; }
      if (entity.mode !== 'ATTACK' || entity.hasAttackedThisTurn) return;
      
      setActiveAttackerId(prev => prev === entity.instanceId ? null : entity.instanceId);
      setSelectedCard(entity.card);
      setPlayingCard(null);

    } else {
      if (activeAttackerId) {
        setIsAnimating(true);
        const attackerId = activeAttackerId;
        const targetId = entity?.instanceId;
        setActiveAttackerId(null); 
        clearSelection();

        // SI ATACAMOS A UNA CARTA BOCA ABAJO (DEFENSE / SET)
        if (entity && (entity.mode === 'DEFENSE' || entity.mode === 'SET')) {
          // 1. Revelamos la carta visualmente para que el jugador vea qué ha atacado
          setRevealedEntities(prev => [...prev, targetId!]);
          // 2. Esperamos que termine la animación de volteo
          await sleep(800); 
        }

        // 3. Aplicamos el daño y la enviamos al cementerio
        applyTransition((state) => GameEngine.executeAttack(state, state.playerA.id, attackerId, targetId));
        
        // Limpiamos los revelados tras la muerte
        if (targetId) setRevealedEntities(prev => prev.filter(id => id !== targetId));
        setIsAnimating(false);

      } else if (entity) {
        setSelectedCard(entity.card); 
      }
    }
  };

  return { gameState, selectedCard, playingCard, isHistoryOpen, activeAttackerId, revealedEntities, lastError, setIsHistoryOpen, toggleCardSelection, clearSelection, clearError, executePlayAction, handleEntityClick, advancePhase };
}
