import { useState } from "react";
import { ICard } from "@/core/entities/ICard";

export function useBoard() {
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [playingCard, setPlayingCard] = useState<ICard | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const toggleCardSelection = (card: ICard, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingCard?.id === card.id) {
      setSelectedCard(null);
      setPlayingCard(null);
    } else {
      setSelectedCard(card);
      setPlayingCard(card);
    }
  };

  const clearSelection = () => {
    setSelectedCard(null);
    setPlayingCard(null);
    setIsHistoryOpen(false);
  };

  const executePlayAction = (mode: 'ATTACK' | 'DEFENSE', e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`[SYS] Ejecutando orden: ${playingCard?.name} -> ${mode}`);
    // Aquí conectaremos el CombatService en el futuro
    setPlayingCard(null);
  };

  return {
    selectedCard,
    playingCard,
    isHistoryOpen,
    setIsHistoryOpen,
    toggleCardSelection,
    clearSelection,
    executePlayAction,
    setSelectedCard, // Expuesto por si un slot del Battlefield necesita forzar la selección
    setPlayingCard
  };
}