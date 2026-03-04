// src/components/hub/home/HomeCollectionPanel.tsx - Muestra el almacén de cartas y permite añadir cartas al deck.
import { motion } from "framer-motion";
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IDeck } from "@/core/entities/home/IDeck";
import { HomeMiniCard } from "@/components/hub/home/HomeMiniCard";

interface HomeCollectionPanelProps {
  deck: IDeck;
  collection: ICollectionCard[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
}

export function HomeCollectionPanel({ deck, collection, selectedCardId, onSelectCard }: HomeCollectionPanelProps) {
  const usedByCardId = new Map<string, number>();
  for (const slot of deck.slots) {
    if (!slot.cardId) continue;
    usedByCardId.set(slot.cardId, (usedByCardId.get(slot.cardId) ?? 0) + 1);
  }

  return (
    <section className="rounded-2xl border border-cyan-800/35 bg-transparent p-1">
      <h2 className="mb-3 text-lg font-black uppercase tracking-wide text-cyan-200">Almacén</h2>
      <div className="grid grid-cols-5 gap-2">
        {collection.map((entry) => {
          const usedCopies = usedByCardId.get(entry.card.id) ?? 0;
          const canAdd = usedCopies < Math.min(3, entry.ownedCopies);
          const isSelected = selectedCardId === entry.card.id;
          return (
            <motion.button
              key={entry.card.id}
              type="button"
              aria-label={`Seleccionar ${entry.card.name}`}
              whileHover={{ y: -2 }}
              onClick={() => onSelectCard(entry.card.id)}
              className={canAdd ? "text-left" : "cursor-not-allowed text-left opacity-60"}
            >
              <HomeMiniCard
                card={entry.card}
                label={`Carta ${entry.card.name}`}
                isSelected={isSelected}
              />
              <p className="mt-0.5 text-center text-[10px] font-semibold text-cyan-200/75">
                En deck: {usedCopies}/{Math.min(3, entry.ownedCopies)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
