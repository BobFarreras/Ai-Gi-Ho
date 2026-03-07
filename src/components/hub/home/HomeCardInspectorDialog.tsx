// src/components/hub/home/HomeCardInspectorDialog.tsx - Diálogo mobile para inspección detallada de carta en Arsenal.
"use client";

import { ICard } from "@/core/entities/ICard";
import { HomeCardInspector } from "@/components/hub/home/HomeCardInspector";
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
  onClose,
}: HomeCardInspectorDialogProps) {
  return (
    <MobileInspectorDialogShell
      isOpen={isOpen}
      origin={origin}
      onClose={onClose}
      closeAriaLabel="Cerrar inspección de carta"
      overlayTopClassName="top-[96px]"
      panelTopClassName="top-[104px]"
    >
      <HomeCardInspector
        selectedCard={selectedCard}
        selectedCardVersionTier={selectedCardVersionTier}
        selectedCardLevel={selectedCardLevel}
        selectedCardXp={selectedCardXp}
        selectedCardMasteryPassiveSkillId={selectedCardMasteryPassiveSkillId}
      />
    </MobileInspectorDialogShell>
  );
}
