// src/app/hub/home/page.tsx - Renderiza Mi Home con constructor de deck y fallback bloqueado según progreso.
import { HubSectionScreen } from "@/components/hub/sections/HubSectionScreen";
import { getHubSectionViewModel } from "@/app/hub/internal/getHubSectionViewModel";
import { HomeDeckBuilderScene } from "@/components/hub/home/HomeDeckBuilderScene";
import { GetHomeDeckBuilderDataUseCase } from "@/core/use-cases/home/GetHomeDeckBuilderDataUseCase";
import { InMemoryDeckRepository } from "@/infrastructure/repositories/InMemoryDeckRepository";

export default async function HomeModulePage() {
  const playerId = "local-player";
  const viewModel = await getHubSectionViewModel("HOME");
  if (viewModel.section.isLocked) {
    return (
      <HubSectionScreen
        title={viewModel.section.title}
        description="Gestiona mazos, preferencias de cuenta y datos personales del duelista."
        isLocked={viewModel.section.isLocked}
        lockReason={viewModel.section.lockReason}
      />
    );
  }

  const repository = new InMemoryDeckRepository();
  const getHomeDeckBuilderDataUseCase = new GetHomeDeckBuilderDataUseCase(repository);
  const data = await getHomeDeckBuilderDataUseCase.execute(playerId);

  return <HomeDeckBuilderScene playerId={playerId} initialDeck={data.deck} collection={data.collection} />;
}
