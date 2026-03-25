// src/components/admin/internal/AdminStarterDeckCollectionPanel.tsx - Panel derecho de almacén para seleccionar y arrastrar cartas al starter deck.
"use client";

import { DragEvent, useMemo, useState } from "react";
import { ICard } from "@/core/entities/ICard";
import { HomeMiniCard } from "@/components/hub/home/HomeMiniCard";

interface IAdminStarterDeckCollectionPanelProps {
  availableCards: ICard[];
  selectedCardId: string | null;
  isEditMode: boolean;
  onSelectCard: (cardId: string) => void;
  onDropToCollection: (event: DragEvent<HTMLElement>) => void;
  onStartDragCard: (cardId: string, event: DragEvent<HTMLElement>) => void;
}

export function AdminStarterDeckCollectionPanel({
  availableCards,
  selectedCardId,
  isEditMode,
  onSelectCard,
  onDropToCollection,
  onStartDragCard,
}: IAdminStarterDeckCollectionPanelProps) {
  const [query, setQuery] = useState("");
  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return availableCards;
    return availableCards.filter((card) => card.name.toLowerCase().includes(normalized) || card.id.toLowerCase().includes(normalized));
  }, [availableCards, query]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-cyan-800/35 bg-[#031020]/50 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Almacén</h2>
        <span className="text-xs text-cyan-100/70">{filteredCards.length} cartas</span>
      </div>
      <input
        type="search"
        aria-label="Buscar carta en almacén admin"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre o id..."
        className="mb-3 rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100"
      />
      <div className="home-modern-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2" onDragOver={(event) => event.preventDefault()} onDrop={onDropToCollection}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-3 justify-items-center pb-4">
          {filteredCards.map((card) => (
            <button key={card.id} type="button" aria-label={`Seleccionar ${card.name}`} onClick={() => onSelectCard(card.id)} className="relative flex w-[84px] flex-col items-center">
              <HomeMiniCard
                card={card}
                label={`Carta ${card.name}`}
                isSelected={selectedCardId === card.id}
                isDraggable={isEditMode}
                onDragStart={(event) => onStartDragCard(card.id, event)}
                showSlotContainer={false}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

