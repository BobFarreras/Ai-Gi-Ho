// src/app/hub/page.tsx - Página servidor del dashboard central que compone caso de uso y repositorio.
import { HubDashboard } from "@/components/hub/HubDashboard";
import { HubService } from "@/core/services/hub/HubService";
import { GetHubDashboardUseCase } from "@/core/use-cases/hub/GetHubDashboardUseCase";
import { InMemoryHubRepository } from "@/infrastructure/repositories/InMemoryHubRepository";

export default async function HubPage() {
  const repository = new InMemoryHubRepository();
  const service = new HubService(repository);
  const getHubDashboardUseCase = new GetHubDashboardUseCase(service);
  const dashboard = await getHubDashboardUseCase.execute("local-player");

  return <HubDashboard progress={dashboard.progress} sections={dashboard.sections} />;
}
