import { Card } from "@/components/game/Card";
import { ICard } from "@/core/entities/ICard";

/**
 * Mock data for initial UI testing.
 * In the future, this will be fetched from the Supabase repository.
 */
const mockCards: ICard[] = [
  {
    id: "card-1",
    name: "Gemini 3.1 Pro",
    description: "Modelo fundacional superinteligente. Destruye la defensa enemiga con lógica aplastante.",
    type: "ENTITY",
    faction: "BIG_TECH",
    cost: 8,
    attack: 3000,
    defense: 2500,
  },
  {
    id: "card-2",
    name: "Llama 3 Local",
    description: "Se ejecuta en tu máquina. Inmune a cortes de internet y miradas indiscretas.",
    type: "ENTITY",
    faction: "OPEN_SOURCE",
    cost: 5,
    attack: 2200,
    defense: 2800,
  },
  {
    id: "card-3",
    name: "Flujo de Make",
    description: "Automatiza 3 ataques seguidos si el enemigo tiene menos de 1000 de defensa.",
    type: "EXECUTION",
    faction: "NO_CODE",
    cost: 3,
  },
  {
    id: "card-4",
    name: "Servidor Caído",
    description: "Anula todas las cartas de tipo BIG_TECH durante un turno.",
    type: "ENVIRONMENT",
    faction: "NEUTRAL",
    cost: 2,
    defense: 1000, // Una carta de entorno con algo de resistencia
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-600 tracking-tight">
          AI-Gi-Oh!
        </h1>
        <p className="text-zinc-400 mt-2 text-lg tracking-widest uppercase">
          The AGI Wars
        </p>
      </div>

      {/* Grid de Cartas */}
      <div className="flex flex-wrap gap-8 justify-center items-center perspective-1000">
        {mockCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      <div className="mt-16 text-zinc-500 text-sm">
        Pasa el ratón sobre las cartas para ver las físicas de Framer Motion
      </div>
    </main>
  );
}