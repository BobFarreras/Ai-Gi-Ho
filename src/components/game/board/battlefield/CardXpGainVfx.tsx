// src/components/game/board/battlefield/CardXpGainVfx.tsx - Efecto flotante de experiencia ganada sobre una carta del campo.
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardXpGainVfxProps {
  eventId: string;
  entityId: string;
  amount: number;
}

export function CardXpGainVfx({ eventId, entityId, amount }: CardXpGainVfxProps) {
  return (
    <>
      <motion.div
        key={`${eventId}-${entityId}-xp-aura`}
        initial={{ opacity: 0, scale: 0.76 }}
        animate={{ opacity: [0, 1, 0], scale: [0.76, 1.24, 1.06] }}
        transition={{ duration: 1.05, ease: "easeOut" }}
        className="pointer-events-none absolute -inset-5 z-[78] rounded-3xl bg-[radial-gradient(circle,rgba(45,212,191,0.46)_0%,rgba(45,212,191,0.08)_48%,rgba(45,212,191,0)_75%)]"
      />
      <motion.div
        key={`${eventId}-${entityId}-xp-text`}
        initial={{ opacity: 0, y: 18, scale: 0.72 }}
        animate={{ opacity: [0, 1, 0], y: [18, -32, -62], scale: [0.72, 1.08, 1] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={cn("pointer-events-none absolute left-1/2 top-2 z-[82] -translate-x-1/2 rounded-full border border-emerald-300/70 bg-emerald-950/85 px-5 py-2 text-5xl font-black leading-none text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.58)]")}
      >
        +{amount} EXP
      </motion.div>
    </>
  );
}
