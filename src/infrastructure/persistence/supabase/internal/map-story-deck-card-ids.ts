// src/infrastructure/persistence/supabase/internal/map-story-deck-card-ids.ts - Expande filas de mazo de historia en lista ordenada de card_id para inicializar duelo.
interface IStoryDeckCardRow {
  card_id: string;
  copies: number;
}

export function mapStoryDeckCardIds(rows: IStoryDeckCardRow[]): string[] {
  return rows.flatMap((row) => Array.from({ length: row.copies }).map(() => row.card_id));
}
