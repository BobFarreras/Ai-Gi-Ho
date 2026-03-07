// src/components/hub/home/layout/HomeMobileWorkspace.tsx - Distribución mobile inicial del Arsenal sin alterar lógica de negocio.
"use client";

import { useState, type PointerEvent } from "react";
import { HomeCardInspectorDialog } from "@/components/hub/home/HomeCardInspectorDialog";
import { HomeCollectionPanel } from "@/components/hub/home/HomeCollectionPanel";
import { HomeDeckPanel } from "@/components/hub/home/HomeDeckPanel";
import { IInspectorOrigin } from "@/components/hub/internal/mobile-inspector-animation";
import { IHomeWorkspaceProps } from "@/components/hub/home/layout/home-workspace-types";

export function HomeMobileWorkspace(props: IHomeWorkspaceProps) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorOrigin, setInspectorOrigin] = useState<IInspectorOrigin>({ x: 0, y: 0 });
  const capturePointerOrigin = (event: PointerEvent<HTMLDivElement>) => {
    setInspectorOrigin({ x: event.clientX, y: event.clientY });
  };
  const handleSelectSlot = (slotIndex: number) => {
    const slotCardId = props.deck.slots[slotIndex]?.cardId ?? null;
    props.onSelectSlot(slotIndex);
    if (slotCardId) setIsInspectorOpen(true);
  };
  const handleSelectCollectionCard = (cardId: string) => {
    props.onSelectCollectionCard(cardId);
    setIsInspectorOpen(true);
  };

  return (
    <div className="mt-4 grid min-h-0 flex-1 gap-4 xl:hidden" onPointerDownCapture={capturePointerOrigin}>
      <div className="min-h-0 min-w-0 overflow-visible rounded-xl border border-cyan-900/30 bg-black/40">
        <HomeDeckPanel
          deck={props.deck}
          collection={props.collectionState}
          cardProgressById={props.cardProgressById}
          selectedSlotIndex={props.selectedSlotIndex}
          selectedCardId={props.selectedCardId}
          onSelectSlot={handleSelectSlot}
        />
      </div>
      <div className="min-h-0 min-w-0 overflow-hidden rounded-xl border border-cyan-900/30 bg-black/40">
        <HomeCollectionPanel
          deck={props.deck}
          collection={props.filteredCollection}
          cardProgressById={props.cardProgressById}
          evolvableCardIds={props.evolvableCardIds}
          selectedCardId={props.selectedCollectionCardId}
          onSelectCard={handleSelectCollectionCard}
        />
      </div>
      <HomeCardInspectorDialog
        isOpen={isInspectorOpen}
        origin={inspectorOrigin}
        selectedCard={props.selectedCard}
        selectedCardVersionTier={props.selectedCardVersionTier}
        selectedCardLevel={props.selectedCardLevel}
        selectedCardXp={props.selectedCardXp}
        selectedCardMasteryPassiveSkillId={props.selectedCardMasteryPassiveSkillId}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
}
