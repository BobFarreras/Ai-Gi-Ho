import { ICard } from './ICard';

export interface IPlayer {
  readonly id: string;
  readonly name: string;
  readonly healthPoints: number;
  readonly maxHealthPoints: number;
  readonly currentEnergy: number;
  readonly maxEnergy: number;
  
  // Zonas del jugador
  readonly deck: string[];     // Array de IDs de las cartas (referencias)
  readonly hand: ICard[];      // Cartas físicas que el jugador tiene en la mano
  readonly graveyard: string[];// Cartas destruidas
}