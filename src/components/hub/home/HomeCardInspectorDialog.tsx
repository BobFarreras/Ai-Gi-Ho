// src/components/hub/home/HomeCardInspectorDialog.tsx - Diálogo mobile para inspección detallada de carta en Arsenal.
"use client";

import { ICard } from "@/core/entities/ICard";
import { HomeCardInspector } from "@/components/hub/home/HomeCardInspector";
import { HomeInspectorActionButtons } from "@/components/hub/home/HomeInspectorActionButtons";
import { IInspectorOrigin } from "@/components/hub/internal/mobile-inspector-animation";
import { MobileInspectorDialogShell } from "@/components/hub/internal/MobileInspectorDialogShell";

interface HomeCardInspectorDialogProps {
  isOpen: boolean;
  origin: IInspectorOrigin;
  selectedCard: ICard | null;
  selectedCardVersionTier: number;
  selectedCardLevel: number;
  selectedCardXp: number;
  selectedCardMasteryPassiveSkillId: string | null;
  selectedCardSource: "DECK" | "COLLECTION" | "NONE";
  canInsert: boolean;
  canRemove: boolean;
  canEvolve: boolean;
  evolveCost: number | null;
  onInsert: () => void;
  onRemove: () => void;
  onEvolve: () => void;
  onClose: () => void;
}

export function HomeCardInspectorDialog({
  isOpen,
  origin,
  selectedCard,
  selectedCardVersionTier,
  selectedCardLevel,
  selectedCardXp,
  selectedCardMasteryPassiveSkillId,
  selectedCardSource,
  canInsert,
  canRemove,
  canEvolve,
  evolveCost,
  onInsert,
  onRemove,
  onEvolve,
  onClose,
}: HomeCardInspectorDialogProps) {
  return (
    <MobileInspectorDialogShell
      isOpen={isOpen}
      origin={origin}
      onClose={onClose}
      closeAriaLabel="Cerrar inspección de carta"
      overlayTopClassName="top-[80px]"
      panelTopClassName="top-[88px] max-h-[calc(100dvh-96px)]"
    >
      <div className="flex h-full min-h-0 flex-col">
        <HomeCardInspector
          selectedCard={selectedCard}
          selectedCardVersionTier={selectedCardVersionTier}
          selectedCardLevel={selectedCardLevel}
          selectedCardXp={selectedCardXp}
          selectedCardMasteryPassiveSkillId={selectedCardMasteryPassiveSkillId}
        />
        <HomeInspectorActionButtons
          source={selectedCardSource}
          canInsert={canInsert}
          canRemove={canRemove}
          canEvolve={canEvolve}
          evolveCost={evolveCost}
          onInsert={onInsert}
          onRemove={onRemove}
          onEvolve={onEvolve}
        />
      </div>
    </MobileInspectorDialogShell>
  );
}
