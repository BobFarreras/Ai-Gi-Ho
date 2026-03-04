// src/components/hub/home/HomeMiniCard.tsx - Renderiza una versión compacta de la carta real del juego para Mi Home.
"use client";

import { ICard } from "@/core/entities/ICard";
import { Card } from "@/components/game/card/Card";

interface HomeMiniCardProps {
  card: ICard | null;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function HomeMiniCard({ card, label, isSelected = false, onClick }: HomeMiniCardProps) {
  const containerClass = isSelected
    ? "relative h-[112px] w-[84px] rounded-lg border border-amber-300 bg-[#0a1320]"
    : "relative h-[112px] w-[84px] rounded-lg border border-cyan-900/55 bg-[#081220]";

  const Wrapper = onClick ? "button" : "div";
  const wrapperProps = onClick
    ? { type: "button" as const, "aria-label": label, onClick }
    : { "aria-label": label };

  if (!card) {
    return (
      <Wrapper
        {...wrapperProps}
        className={`${containerClass} flex items-center justify-center text-center text-[10px] font-semibold text-cyan-100/70`}
      >
        Slot vacío
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={containerClass}
    >
      <div className="absolute left-0 top-0 origin-top-left scale-[0.323]">
        <Card card={card} />
      </div>
    </Wrapper>
  );
}
