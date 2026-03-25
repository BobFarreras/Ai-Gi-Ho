// src/services/admin/api/create-admin-catalog-context.ts - Fabrica repositorio y casos de uso de catálogo para rutas admin de mercado/cartas.
import { NextRequest } from "next/server";
import { GetAdminCatalogSnapshotUseCase } from "@/core/use-cases/admin/GetAdminCatalogSnapshotUseCase";
import { UpsertAdminCardCatalogUseCase } from "@/core/use-cases/admin/UpsertAdminCardCatalogUseCase";
import { UpsertAdminMarketListingUseCase } from "@/core/use-cases/admin/UpsertAdminMarketListingUseCase";
import { UpsertAdminMarketPackUseCase } from "@/core/use-cases/admin/UpsertAdminMarketPackUseCase";
import { SupabaseAdminCatalogRepository } from "@/infrastructure/persistence/supabase/admin/SupabaseAdminCatalogRepository";
import { createAdminRouteContext } from "@/services/admin/api/create-admin-route-context";
import { createSupabaseRouteClient } from "@/infrastructure/persistence/supabase/internal/create-supabase-route-client";

export async function createAdminCatalogContext(request: NextRequest) {
  const routeContext = await createAdminRouteContext(request);
  const client = createSupabaseRouteClient(request, routeContext.response);
  const repository = new SupabaseAdminCatalogRepository(client);
  return {
    ...routeContext,
    getSnapshotUseCase: new GetAdminCatalogSnapshotUseCase(repository),
    upsertCardUseCase: new UpsertAdminCardCatalogUseCase(repository),
    upsertListingUseCase: new UpsertAdminMarketListingUseCase(repository),
    upsertPackUseCase: new UpsertAdminMarketPackUseCase(repository),
  };
}
