// src/infrastructure/persistence/supabase/internal/map-story-deck-card-ids.test.ts - Valida expansión ordenada de copias de cartas para mazos de historia.
import { describe, expect, it } from "vitest";
import { mapStoryDeckCardIds } from "@/infrastructure/persistence/supabase/internal/map-story-deck-card-ids";

describe("map-story-deck-card-ids", () => {
  it("expande copias manteniendo orden de filas", () => {
    const result = mapStoryDeckCardIds([
      { card_id: "entity-python", copies: 2 },
      { card_id: "exec-draw-1", copies: 1 },
      { card_id: "trap-atk-drain", copies: 3 },
    ]);
    expect(result).toEqual([
      "entity-python",
      "entity-python",
      "exec-draw-1",
      "trap-atk-drain",
      "trap-atk-drain",
      "trap-atk-drain",
    ]);
  });
});
