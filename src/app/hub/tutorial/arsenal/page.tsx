// src/app/hub/tutorial/arsenal/page.tsx - Página server-side del nodo Preparar Deck con UI real de Arsenal y overlay guiado.
import { TutorialArsenalClient } from "@/app/hub/tutorial/arsenal/TutorialArsenalClient";
import { HubSectionEntryBurst } from "@/components/hub/sections/HubSectionEntryBurst";
import { GetHomeDeckBuilderDataUseCase } from "@/core/use-cases/home/GetHomeDeckBuilderDataUseCase";
import { sharedDeckRepository } from "@/infrastructure/repositories/singletons";
import { getCurrentUserSession } from "@/services/auth/get-current-user-session";
import { createPlayerRuntimeRepositories } from "@/services/player-persistence/create-player-runtime-repositories";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function TutorialArsenalPage() {
  const session = await getCurrentUserSession();
  const playerId = session?.user.id ?? "local-player";
  const runtimeRepositories = session ? await createPlayerRuntimeRepositories() : null;
  const deckRepository = runtimeRepositories?.deckRepository ?? sharedDeckRepository;
  const getHomeDeckBuilderDataUseCase = new GetHomeDeckBuilderDataUseCase(deckRepository);
  const [data, cardProgress] = await Promise.all([
    getHomeDeckBuilderDataUseCase.execute(playerId),
    runtimeRepositories?.playerCardProgressRepository.listByPlayer(playerId) ?? Promise.resolve([]),
  ]);
  return (
    <>
      <HubSectionEntryBurst />
      <TutorialArsenalClient
        playerId={playerId}
        initialDeck={data.deck}
        collection={data.collection}
        initialCardProgress={cardProgress}
      />
    </>
  );
}
