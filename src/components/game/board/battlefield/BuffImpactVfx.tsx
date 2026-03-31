// src/components/game/board/battlefield/BuffImpactVfx.tsx - VFX de aumento/reducción temporal de estadísticas sobre entidades en el campo.
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBoardPerformanceProfile } from "@/components/game/board/internal/use-board-performance-profile";

interface BuffImpactVfxProps {
  eventId: string;
  entityId: string;
  stat: "ATTACK" | "DEFENSE";
  amount: number;
}

export function BuffImpactVfx({ eventId, entityId, stat, amount }: BuffImpactVfxProps) {
  const isDebuff = amount < 0;
  const absoluteAmount = Math.abs(amount);
  const isAttack = stat === "ATTACK";
  const colorClass = isDebuff ? "text-amber-200" : isAttack ? "text-red-300" : "text-blue-300";
  const { shouldReduceCombatEffects } = useBoardPerformanceProfile();

  if (shouldReduceCombatEffects) {
    return (
      <div className={cn("absolute top-1 left-1/2 z-[80] -translate-x-1/2 text-lg font-black leading-none", colorClass)}>
        {isDebuff ? "-" : "+"}
        {absoluteAmount}
      </div>
    );
  }

  return (
    <>
      <motion.div
        key={`${eventId}-${entityId}-aura`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.85, 0], scale: [0.7, 1.35, 1.1] }}
        transition={{ duration: 1.45, ease: "easeOut" }}
        className={cn(
          "absolute inset-0 z-[78] rounded-2xl",
          isAttack
            ? "bg-[radial-gradient(circle,rgba(248,113,113,0.52)_0%,rgba(248,113,113,0.12)_45%,rgba(248,113,113,0)_80%)]"
            : "bg-[radial-gradient(circle,rgba(96,165,250,0.52)_0%,rgba(96,165,250,0.12)_45%,rgba(96,165,250,0)_80%)]",
        )}
      />
      <motion.div
        key={`${eventId}-${entityId}-amount`}
        initial={{ opacity: 0, y: 14, scale: 0.84 }}
        animate={{ opacity: [0, 1, 1, 0], y: [14, -26, -54], scale: [0.84, 1.18, 1.08] }}
        transition={{ duration: 1.45, ease: "easeOut" }}
        className={cn(
          "absolute top-1 left-1/2 -translate-x-1/2 z-[80] font-black text-3xl leading-none drop-shadow-[0_0_20px_rgba(0,0,0,0.95)]",
          colorClass,
        )}
      >
        {isDebuff ? "-" : "+"}
        {absoluteAmount}
      </motion.div>
    </>
  );
}
