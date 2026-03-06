// src/components/landing/HeroCards.tsx - Abanico animado de cartas destacadas en el hero de la landing.
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/game/card/Card";
import type { ICard } from "@/core/entities/ICard";

const LORE_CARDS: ICard[] = [
  {
    id: "sys-001",
    name: "Gemini 1.5 Pro",
    description: "Visión Multimodal: Analiza el tablero completo. Aumenta el ataque de todas las entidades aliadas.",
    type: "ENTITY",
    faction: "BIG_TECH",
    archetype: "LLM",
    cost: 8,
    attack: 3000,
    defense: 2500,
    renderUrl: "/assets/renders/gemini.png",
    versionTier: 1,
    level: 5,
  },
  {
    id: "sys-002",
    name: "Ollama Local",
    description: "Escudo de Privacidad: Inmune a las Cartas de Ejecución (Trampas) del oponente.",
    type: "ENTITY",
    faction: "OPEN_SOURCE",
    archetype: "LLM",
    cost: 4,
    attack: 1500,
    defense: 2800,
    renderUrl: "/assets/renders/ollama.png",
    versionTier: 1,
    level: 4,
    
  },
  {
    id: "sys-003",
    name: "Bucle Infinito n8n",
    description: "Atrapa el proceso del rival. Cuando el oponente ataca, su ataque es anulado y pierde el turno.",
    type: "TRAP",
    faction: "NO_CODE",
    archetype: "TOOL",
    trigger: "ON_OPPONENT_ATTACK_DECLARED",
    cost: 2,
    renderUrl: "/assets/renders/n8n.png",
    versionTier: 1,
    level: 1,
  }
];

export function HeroCards() {
  return (
    <div className="relative flex h-full w-full items-center justify-center perspective-[1200px] scale-[0.52] sm:scale-[0.62] md:scale-[0.76] lg:scale-[0.84]">
      
      {/* Carta Izquierda (Más separada y girada) */}
      <motion.div
        initial={{ opacity: 0, x: -150, rotateY: -30, rotateZ: -10 }}
        animate={{ opacity: 1, x: -230, rotateY: -20, rotateZ: -16 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
        className="absolute z-10"
      >
        <Card card={LORE_CARDS[1]} />
      </motion.div>

      {/* Carta Centro */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: -16, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
        className="absolute z-30 shadow-[0_0_60px_rgba(59,130,246,0.3)]"
      >
        <Card card={LORE_CARDS[0]} />
      </motion.div>

      {/* Carta Derecha (Más separada y girada) */}
      <motion.div
        initial={{ opacity: 0, x: 150, rotateY: 30, rotateZ: 10 }}
        animate={{ opacity: 1, x: 230, rotateY: 20, rotateZ: 16 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.8 }}
        className="absolute z-20"
      >
        <Card card={LORE_CARDS[2]} />
      </motion.div>
    </div>
  );
}
