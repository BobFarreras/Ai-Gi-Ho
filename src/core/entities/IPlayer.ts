// src/core/entities/IPlayer.ts
import { ICard } from './ICard';

export type BattleMode = 'ATTACK' | 'DEFENSE' | 'SET';

// NUEVA INTERFAZ: Representa una carta cuando ya está en el tablero
export interface IBoardEntity {
  readonly instanceId: string; // ID único para el tablero (por si juegas 2 cartas iguales)
  readonly card: ICard;
  readonly mode: BattleMode;
  readonly hasAttackedThisTurn: boolean;
  readonly isNewlySummoned: boolean;
}

export interface IPlayer {
  readonly id: string;
  readonly name: string;
  readonly healthPoints: number;
  readonly maxHealthPoints: number;
  readonly currentEnergy: number;
  readonly maxEnergy: number;
  
  // Zonas del jugador
  readonly deck: string[];       
  readonly hand: ICard[];        
  readonly graveyard: ICard[];  
  
  // Zonas de Batalla Actualizadas
  readonly activeEntities: IBoardEntity[];   // <- Ahora usan IBoardEntity
  readonly activeExecutions: IBoardEntity[]; // <- Magias/Trampas en el campo
}