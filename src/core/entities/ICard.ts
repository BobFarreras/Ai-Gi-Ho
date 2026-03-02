export type CardType = 'ENTITY' | 'EXECUTION' | 'ENVIRONMENT';
export type Faction = 'OPEN_SOURCE' | 'BIG_TECH' | 'NO_CODE' | 'NEUTRAL';

export interface ICard {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: CardType;
  readonly faction: Faction;
  readonly cost: number;       // Energía o Maná necesario para jugarla
  readonly attack?: number;    // Opcional: Cartas de entorno pueden no tener
  readonly defense?: number;   // Opcional
  readonly imageUrl?: string;  // Opcional: URL de la imagen (Supabase Storage)
  readonly effectId?: string;  // Opcional: ID de una habilidad especial
}