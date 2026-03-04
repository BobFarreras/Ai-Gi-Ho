// src/components/hub/home/HomeDeckBuilderScene.tsx - Orquesta la experiencia visual y acciones del deck builder en Mi Home.
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IDeck } from "@/core/entities/home/IDeck";
import { HomeCardInspector } from "@/components/hub/home/HomeCardInspector";
import { HomeCollectionPanel } from "@/components/hub/home/HomeCollectionPanel";
import { HomeDeckPanel } from "@/components/hub/home/HomeDeckPanel";
import {
  addCardToDeckAction,
  removeCardFromDeckAction,
  saveDeckAction,
} from "@/services/home/deck-builder/deck-builder-actions";

interface HomeDeckBuilderSceneProps {
  playerId: string;
  initialDeck: IDeck;
  collection: ICollectionCard[];
}

export function HomeDeckBuilderScene({ playerId, initialDeck, collection }: HomeDeckBuilderSceneProps) {
  const [deck, setDeck] = useState<IDeck>(initialDeck);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [selectedCollectionCardId, setSelectedCollectionCardId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const filledSlots = useMemo(() => deck.slots.filter((slot) => slot.cardId !== null).length, [deck.slots]);
  const cardById = useMemo(() => new Map(collection.map((entry) => [entry.card.id, entry.card])), [collection]);
  const selectedCardId = useMemo(() => {
    if (selectedCollectionCardId) return selectedCollectionCardId;
    if (selectedSlotIndex === null) return null;
    return deck.slots[selectedSlotIndex]?.cardId ?? null;
  }, [deck.slots, selectedCollectionCardId, selectedSlotIndex]);
  const selectedCard = selectedCardId ? cardById.get(selectedCardId) ?? null : null;
  const selectedSlotHasCard = selectedSlotIndex !== null && deck.slots[selectedSlotIndex].cardId !== null;

  const context = { playerId, deck, collection };

  const setError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "No se pudo completar la acción del deck.";
    setStatusMessage(message);
  };

  return (
    <main className="hub-control-room-bg min-h-screen px-4 py-8 text-slate-100 sm:px-6">
      <section className="mx-auto w-full max-w-7xl rounded-3xl border border-cyan-900/40 bg-[#020a14]/85 p-5 shadow-[0_24px_50px_rgba(2,5,14,0.86)]">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-cyan-900/40 bg-[#061120] px-4 py-3">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide text-cyan-200">Mi Home - Constructor de Deck</h1>
            <p className="text-xs text-slate-300">Selecciona 20 cartas del almacén. Máximo 3 copias de la misma carta.</p>
          </div>
          <button
            type="button"
            aria-label="Guardar deck"
            onClick={async () => {
              try {
                const savedDeck = await saveDeckAction(context);
                setDeck(savedDeck);
                setStatusMessage("Deck guardado correctamente.");
              } catch (error) {
                setError(error);
              }
            }}
            className="rounded-lg border border-cyan-300/45 px-4 py-2 text-xs font-black uppercase text-cyan-200 hover:bg-cyan-400/10"
          >
            Guardar Deck
          </button>
        </header>

        <motion.div layout className="mb-4 rounded-xl border border-cyan-900/40 bg-[#05101c] px-4 py-2 text-xs text-cyan-100/90">
          Cartas en deck: {filledSlots}/20 {selectedSlotIndex !== null ? `| Slot seleccionado: #${selectedSlotIndex + 1}` : ""}
          {statusMessage ? ` | ${statusMessage}` : ""}
        </motion.div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-label="Introducir carta seleccionada en el deck"
            disabled={!selectedCollectionCardId}
            onClick={async () => {
              if (!selectedCollectionCardId) return;
              try {
                const updatedDeck = await addCardToDeckAction(context, selectedCollectionCardId);
                setDeck(updatedDeck);
                setStatusMessage("Carta introducida en el deck.");
              } catch (error) {
                setError(error);
              }
            }}
            className={
              selectedCollectionCardId
                ? "rounded-md border border-cyan-300/45 px-3 py-1 text-xs font-black uppercase text-cyan-200 hover:bg-cyan-400/10"
                : "rounded-md border border-slate-700 px-3 py-1 text-xs font-black uppercase text-slate-500"
            }
          >
            Introducir en Deck
          </button>
          <button
            type="button"
            aria-label="Sacar carta seleccionada del deck"
            disabled={!selectedSlotHasCard}
            onClick={async () => {
              if (selectedSlotIndex === null) return;
              try {
                const updatedDeck = await removeCardFromDeckAction(context, selectedSlotIndex);
                setDeck(updatedDeck);
                setStatusMessage("Carta retirada del deck.");
              } catch (error) {
                setError(error);
              }
            }}
            className={
              selectedSlotHasCard
                ? "rounded-md border border-rose-300/45 px-3 py-1 text-xs font-black uppercase text-rose-200 hover:bg-rose-400/10"
                : "rounded-md border border-slate-700 px-3 py-1 text-xs font-black uppercase text-slate-500"
            }
          >
            Sacar del Deck
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.7fr_1.25fr]">
          <HomeCardInspector selectedCard={selectedCard} />
          <HomeDeckPanel
            deck={deck}
            collection={collection}
            selectedSlotIndex={selectedSlotIndex}
            selectedCardId={selectedCardId}
            onSelectSlot={(slotIndex) => {
              setSelectedCollectionCardId(null);
              setSelectedSlotIndex((previous) => (previous === slotIndex ? null : slotIndex));
            }}
          />
          <HomeCollectionPanel
            deck={deck}
            collection={collection}
            selectedCardId={selectedCollectionCardId}
            onSelectCard={(cardId) => {
              setSelectedSlotIndex(null);
              setSelectedCollectionCardId((previous) => (previous === cardId ? null : cardId));
            }}
          />
        </div>
      </section>
    </main>
  );
}
