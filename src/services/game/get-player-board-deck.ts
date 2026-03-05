// src/services/game/get-player-board-deck.ts - Resuelve el mazo persistido del jugador para inicializar el tablero de combate.
import { ICard } from "@/core/entities/ICard";
import { getCurrentUserSession } from "@/services/auth/get-current-user-session";
import { createPlayerRuntimeRepositories } from "@/services/player-persistence/create-player-runtime-repositories";

const HOME_DECK_SIZE = 20;

export async function getPlayerBoardDeck(): Promise<ICard[] | null> {
  const session = await getCurrentUserSession();
  if (!session?.user.id) return null;
  const repositories = await createPlayerRuntimeRepositories();
  const playerId = session.user.id;
  const [deck, collection] = await Promise.all([
    repositories.deckRepository.getDeck(playerId),
    repositories.deckRepository.getCollection(playerId),
  ]);
  const cardById = new Map(collection.map((entry) => [entry.card.id, entry.card]));
  const persistedDeck = deck.slots
    .map((slot) => (slot.cardId ? cardById.get(slot.cardId) ?? null : null))
    .filter((card): card is ICard => card !== null);
  if (persistedDeck.length !== HOME_DECK_SIZE) return null;
  return persistedDeck.map((card) => ({ ...card }));
}
