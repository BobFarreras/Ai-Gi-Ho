import { ICard } from "@/core/entities/ICard";
import { ENTITY_CARDS } from "@/core/data/mock-cards/entities";
import { EXECUTION_CARDS } from "@/core/data/mock-cards/executions";
import { TRAP_CARDS } from "@/core/data/mock-cards/traps";
import { FUSION_CARDS } from "@/core/data/mock-cards/fusions";

type CardMap = Record<string, ICard>;

const cardCatalog: CardMap = [...ENTITY_CARDS, ...EXECUTION_CARDS, ...TRAP_CARDS, ...FUSION_CARDS].reduce<CardMap>((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {});

const PLAYER_A_DECK_IDS = [
  "entity-chatgpt",
  "exec-direct-damage-900",
  "exec-draw-1",
  "trap-kernel-panic",
  "trap-runtime-punish",
  "trap-atk-drain",
  "trap-def-fragment",
  "entity-gemini",
  "entity-deepseek",
  "entity-claude",
  "entity-react",
  "entity-supabase",
  "exec-boost-atk-400",
  "exec-framework-atk-300",
  "exec-llm-def-300",
  "exec-db-def-300",
  "exec-direct-damage-600",
  "exec-heal-700",
  "entity-openclaw",
  "entity-kali-linux",
] as const;

const PLAYER_B_DECK_IDS = [
  "entity-vscode",
  "entity-cursor",
  "entity-git",
  "entity-perplexity",
  "entity-python",
  "entity-astro",
  "entity-github",
  "entity-n8n",
  "entity-make",
  "exec-heal-700",
  "exec-draw-1",
  "exec-db-def-300",
  "trap-counter-intrusion",
  "entity-ollama",
  "entity-supabase",
  "entity-huggenface",
  "entity-postgress",
  "entity-openclaw",
  "entity-kali-linux",
  "exec-direct-damage-600",
] as const;

function toDeck(deckIds: readonly string[]): ICard[] {
  return deckIds.map((id) => {
    const card = cardCatalog[id];
    if (!card) {
      throw new Error(`Carta no encontrada en catálogo: ${id}`);
    }
    return { ...card };
  });
}

export function shuffleDeck(deck: ICard[], randomFn: () => number = Math.random): ICard[] {
  const shuffled = [...deck];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(randomFn() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export function createPlayerDeckA(): ICard[] {
  return shuffleDeck(toDeck(PLAYER_A_DECK_IDS));
}

export function createPlayerDeckB(): ICard[] {
  return shuffleDeck(toDeck(PLAYER_B_DECK_IDS));
}
