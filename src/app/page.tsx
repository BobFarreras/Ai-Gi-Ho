// src/app/page.tsx
"use client";

import { Board } from "@/components/game/board"; // Importamos del index.tsx automático
import { IPlayer } from "@/core/entities/IPlayer";
import { ICard } from "@/core/entities/ICard";

const mockPlayer: IPlayer = {
  id: "player-1", name: "Prompt Master", healthPoints: 4000, maxHealthPoints: 4000, currentEnergy: 7, maxEnergy: 10, deck: [], hand: [], graveyard: []
};

const mockOpponent: IPlayer = {
  id: "ai-1", name: "Nexus AGI", healthPoints: 4000, maxHealthPoints: 4000, currentEnergy: 10, maxEnergy: 10, deck: [], hand: [], graveyard: []
};

const mockCards: ICard[] = [
  { id: "c1", name: "Gemini 3.1 Pro", description: "Visió total.", type: "ENTITY", faction: "BIG_TECH", cost: 8, attack: 3000, defense: 2500 },
  { id: "c2", name: "Llama Local", description: "Privacitat absoluta.", type: "ENTITY", faction: "OPEN_SOURCE", cost: 5, attack: 2200, defense: 2800 },
  { id: "c3", name: "Make.com", description: "Atac automàtic.", type: "EXECUTION", faction: "NO_CODE", cost: 3 }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Board 
        player={mockPlayer}
        opponent={mockOpponent}
        playerHand={mockCards} 
        playerActiveEntities={[mockCards[0]]} // Gemini en zona de ataque
        playerActiveExecutions={[mockCards[2]]} // Make en zona mágica
        opponentActiveEntities={[mockCards[1]]} // Llama en ataque rival
        opponentActiveExecutions={[]} 
      />
    </main>
  );
}