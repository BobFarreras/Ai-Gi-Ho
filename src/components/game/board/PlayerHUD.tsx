// src/components/game/board/PlayerHUD.tsx - HUD de jugador/oponente con LP, energía, avatar diagonal y burbujas reactivas.
"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { IPlayer } from "@/core/entities/IPlayer";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { HudFloatingDelta } from "./internal/HudFloatingDelta";
import { HudAvatarSlot } from "./internal/HudAvatarSlot";
import { HudDialogueBubble } from "./internal/HudDialogueBubble";
interface PlayerHUDProps {
  isOpponent: boolean;
  player: IPlayer;
  isActiveTurn: boolean;
  badgeText?: string;
  wasDamagedThisAction?: boolean;
  damagePulseKey?: string | null;
  damageAmount?: number | null;
  wasHealedThisAction?: boolean;
  healPulseKey?: string | null;
  healAmount?: number | null;
  avatarUrl?: string | null;
  dialogueMessage?: string | null;
}
export function PlayerHUD({
  isOpponent,
  player,
  isActiveTurn,
  badgeText,
  wasDamagedThisAction = false,
  damagePulseKey = null,
  damageAmount = null,
  wasHealedThisAction = false,
  healPulseKey = null,
  healAmount = null,
  avatarUrl = null,
  dialogueMessage = null,
}: PlayerHUDProps) {
  const lastProcessedDamageEventId = useRef<string | null>(null);
  const lastProcessedHealEventId = useRef<string | null>(null);
  const [damageTaken, setDamageTaken] = useState<number | null>(null);
  const [healGained, setHealGained] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  useEffect(() => {
    if (!wasDamagedThisAction) return;
    if (!damagePulseKey || lastProcessedDamageEventId.current === damagePulseKey) {
      return;
    }

    const damage = damageAmount ?? 0;
    if (damage <= 0) {
      return;
    }
    lastProcessedDamageEventId.current = damagePulseKey;
    const startId = setTimeout(() => {
      setDamageTaken(damage);
      setIsShaking(true);
    }, 0);
    const timer = setTimeout(() => {
      setDamageTaken(null);
      setIsShaking(false);
    }, 1500);
    return () => {
      clearTimeout(startId);
      clearTimeout(timer);
    };
  }, [damageAmount, damagePulseKey, wasDamagedThisAction]);

  useEffect(() => {
    if (!wasHealedThisAction) {
      return;
    }
    if (!healPulseKey || lastProcessedHealEventId.current === healPulseKey) {
      return;
    }

    const heal = healAmount ?? 0;
    if (heal <= 0) {
      return;
    }
    lastProcessedHealEventId.current = healPulseKey;

    const startId = setTimeout(() => setHealGained(heal), 0);
    const timer = setTimeout(() => setHealGained(null), 1500);
    return () => {
      clearTimeout(startId);
      clearTimeout(timer);
    };
  }, [healAmount, healPulseKey, wasHealedThisAction]);
  const shakeAnimation = isShaking ? { x: isOpponent ? [0, -10, 10, -10, 10, 0] : [0, 10, -10, 10, -10, 0] } : { x: 0 };

  return (
    <motion.div
      initial={{ x: isOpponent ? 50 : -50, opacity: 0 }}
      animate={{ ...shakeAnimation, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "absolute z-[100] flex flex-col w-72 pointer-events-none drop-shadow-2xl transition-all duration-300",
        isActiveTurn ? "scale-[1.02] drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]" : "opacity-80",
        isOpponent ? "top-6 right-6 items-end" : "bottom-6 left-6 items-start",
      )}
    >
      <HudFloatingDelta value={damageTaken} sign="-" isOpponent={isOpponent} color="red" />
      <HudFloatingDelta value={healGained} sign="+" isOpponent={isOpponent} color="blue" />
      <HudDialogueBubble isOpponent={isOpponent} message={dialogueMessage} />

      <div className={cn("mb-6 flex items-start gap-2", isOpponent ? "flex-row-reverse" : "flex-row")}>
        <HudAvatarSlot
          isOpponent={isOpponent}
          playerName={player.name}
          healthPoints={player.healthPoints}
          maxHealthPoints={player.maxHealthPoints}
          isActiveTurn={isActiveTurn}
          avatarUrl={avatarUrl}
        />
        {badgeText ? (
          <span className="mt-1 text-[10px] px-2 py-0.5 border border-amber-300/60 bg-amber-500/20 text-amber-200 rounded uppercase tracking-widest font-black">
            {badgeText}
          </span>
        ) : null}
      </div>

      <div className={cn("flex mt-2 space-x-1", isOpponent ? "justify-end" : "justify-start")}>
        <div className="flex items-center bg-zinc-950/90 border border-yellow-500/50 px-4 py-1.5 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Zap className="w-4 h-4 text-yellow-400 mr-2 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
          <span className="text-yellow-400 font-black text-sm">{player.currentEnergy} / {player.maxEnergy}</span>
        </div>
      </div>
    </motion.div>
  );
}
