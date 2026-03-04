// src/services/home/deck-builder/deck-builder-actions.test.ts - Valida acciones de deck builder consumidas por la UI de Mi Home.
import { describe, expect, it } from "vitest";
import { ENTITY_CARDS } from "@/core/data/mock-cards/entities";
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IDeck } from "@/core/entities/home/IDeck";
import { HOME_DECK_SIZE } from "@/core/services/home/deck-rules";
import { addCardToDeckAction, saveDeckAction } from "./deck-builder-actions";

function createEmptyDeck(playerId: string): IDeck {
  return {
    playerId,
    slots: Array.from({ length: HOME_DECK_SIZE }, (_, index) => ({ index, cardId: null })),
  };
}

function createCollection(): ICollectionCard[] {
  return ENTITY_CARDS.slice(0, 20).map((card) => ({ card, ownedCopies: 3 }));
}

describe("deck-builder-actions", () => {
  it("añade carta al primer slot libre", async () => {
    const deck = createEmptyDeck("player-a");
    const collection = createCollection();
    const updatedDeck = await addCardToDeckAction({ playerId: "player-a", deck, collection }, "entity-python");
    expect(updatedDeck.slots[0].cardId).toBe("entity-python");
  });

  it("falla al guardar deck incompleto", async () => {
    const deck = createEmptyDeck("player-a");
    const collection = createCollection();
    await expect(saveDeckAction({ playerId: "player-a", deck, collection })).rejects.toThrow("El deck debe tener 20 cartas");
  });
});
