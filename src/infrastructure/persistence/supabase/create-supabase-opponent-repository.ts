// src/infrastructure/persistence/supabase/create-supabase-opponent-repository.ts - Fábrica server-side para repositorio de oponentes Story sobre Supabase.
import { SupabaseOpponentRepository } from "@/infrastructure/persistence/supabase/SupabaseOpponentRepository";
import { createSupabaseServerClient } from "@/infrastructure/persistence/supabase/internal/create-supabase-server-client";

export async function createSupabaseOpponentRepository(): Promise<SupabaseOpponentRepository> {
  const client = await createSupabaseServerClient();
  return new SupabaseOpponentRepository(client);
}
