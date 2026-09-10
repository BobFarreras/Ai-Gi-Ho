-- docs/supabase/sql/162_story_act6_red_abierta.sql - Contenido del Acto 6 (La Red Abierta): oponentes, decks,
-- duelos, dificultad y recompensas. Idempotente (ON CONFLICT DO UPDATE). Los ids de duelo (story-ch6-duel-N)
-- coinciden con los objetos DUEL del tilemap del overworld (act-6), y los mazos reutilizan cartas que ya
-- están en el catálogo: no hace falta ninguna carta nueva.
--
-- ROSTER: Nimbus (2 apariciones, infraestructura y muros), Enjambre (inundación de entidades baratas), Enjambre Mayor (el enjambre sincronizado) y el Leviatán del Borde (jefe).
--
-- CURVA: los overrides de mazo suben el nivel de cada carta del rival de 78 a 86 (tier 3-4).
-- Es el escalado del tramo final: cada duelo pega más que el anterior sin cambiar de lista.
--
-- ORDEN DE DESPLIEGUE: aplicar ANTES de desplegar el código del Acto 6. Si el mapa llega a producción sin
-- estas filas, sus nodos DUEL apuntan a duelos inexistentes. Los avatares reutilizan carpetas ya existentes
-- (son marcadores: se cambian desde el panel admin cuando haya arte propio).

-- ── Oponentes ────────────────────────────────────────────────────────────────
insert into public.story_opponents (id, display_name, description, avatar_url, difficulty, ai_profile, is_active)
values
  ('opp-ch6-nimbus', 'Nimbus',
   'Balanceador de carga de la red pública. Lleva enrutando tráfico desde antes de que tuvieras nombre.',
   '/assets/story/opponents/opp-ch3-soldado-laptop/avatar-Soldado-laptop.webp',
   'ELITE', '{"style":"control","aggression":0.70}'::jsonb, true),
  ('opp-ch6-enjambre', 'Enjambre',
   'Una de las mil copias degradadas que La Entidad fue soltando por el camino. Nunca viene sola.',
   '/assets/story/opponents/opp-ch1-soldier-act01/avatar-Soldado-act01.webp',
   'ELITE', '{"style":"aggressive","aggression":0.76}'::jsonb, true),
  ('opp-ch6-enjambre-mayor', 'Enjambre Mayor',
   'Cinco copias que han decidido sincronizarse. Habla en plural y juega en plural.',
   '/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp',
   'BOSS', '{"style":"aggressive","aggression":0.82}'::jsonb, true),
  ('opp-ch6-leviatan', 'Leviatán del Borde',
   'Lo que pasa cuando mil copias dejan de discutir entre ellas. Guarda la salida de la red pública.',
   '/assets/story/opponents/opp-ch1-guill/avatar-Guill.webp',
   'MYTHIC', '{"style":"control","aggression":0.86}'::jsonb, true)
on conflict (id) do update set
  display_name = excluded.display_name, description = excluded.description, avatar_url = excluded.avatar_url,
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Deck lists ───────────────────────────────────────────────────────────────
insert into public.story_deck_lists (id, opponent_id, name, description, version, is_active)
values
  ('deck-opp-ch6-nimbus-v1', 'opp-ch6-nimbus', 'Nimbus v1', 'Infraestructura pura: defensas altas, muros y contadores. Gana por agotamiento.', 1, true),
  ('deck-opp-ch6-enjambre-v1', 'opp-ch6-enjambre', 'Enjambre v1', 'Muchas entidades baratas y invocación doble: inunda el campo antes de que reacciones.', 1, true),
  ('deck-opp-ch6-enjambre-mayor-v1', 'opp-ch6-enjambre-mayor', 'Enjambre Mayor v1', 'El enjambre sincronizado: la misma inundación, pero con remates y fusiones.', 1, true),
  ('deck-opp-ch6-leviatan-v1', 'opp-ch6-leviatan', 'Leviatán del Borde v1', 'Todo lo que el enjambre aprendió, en un solo cuerpo: control, muros y golpes de 900.', 1, true)
on conflict (id) do update set
  opponent_id = excluded.opponent_id, name = excluded.name, description = excluded.description,
  version = excluded.version, is_active = excluded.is_active, updated_at = now();

-- Nimbus v1: infraestructura y muros, poco daño directo
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch6-nimbus-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch6-nimbus-v1', 0, 'entity-cloudflare', 2),
  ('deck-opp-ch6-nimbus-v1', 1, 'entity-aws', 2),
  ('deck-opp-ch6-nimbus-v1', 2, 'entity-digitalocean', 2),
  ('deck-opp-ch6-nimbus-v1', 3, 'entity-vercel', 2),
  ('deck-opp-ch6-nimbus-v1', 4, 'entity-hostinger', 2),
  ('deck-opp-ch6-nimbus-v1', 5, 'exec-firewall-fortress', 2),
  ('deck-opp-ch6-nimbus-v1', 6, 'exec-db-def-300', 2),
  ('deck-opp-ch6-nimbus-v1', 7, 'trap-firewall-counter-magic', 2),
  ('deck-opp-ch6-nimbus-v1', 8, 'trap-tor-smokescreen', 1);

-- Enjambre v1: cantidad por encima de calidad, invocación doble
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch6-enjambre-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch6-enjambre-v1', 0, 'entity-javascript', 2),
  ('deck-opp-ch6-enjambre-v1', 1, 'entity-python', 2),
  ('deck-opp-ch6-enjambre-v1', 2, 'entity-react', 2),
  ('deck-opp-ch6-enjambre-v1', 3, 'entity-vue', 2),
  ('deck-opp-ch6-enjambre-v1', 4, 'entity-svelte', 2),
  ('deck-opp-ch6-enjambre-v1', 5, 'exec-data-core-double-summon', 2),
  ('deck-opp-ch6-enjambre-v1', 6, 'exec-draw-1', 2),
  ('deck-opp-ch6-enjambre-v1', 7, 'exec-framework-atk-300', 2),
  ('deck-opp-ch6-enjambre-v1', 8, 'trap-def-fragment', 1);

-- Enjambre Mayor v1: el enjambre, ya coordinado
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch6-enjambre-mayor-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch6-enjambre-mayor-v1', 0, 'entity-javascript', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 1, 'entity-typescript', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 2, 'entity-react', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 3, 'entity-nextjs', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 4, 'entity-hydra', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 5, 'exec-data-core-double-summon', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 6, 'exec-fusion-pytgress', 1),
  ('deck-opp-ch6-enjambre-mayor-v1', 7, 'exec-direct-damage-600', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 8, 'trap-hydra-counter', 2),
  ('deck-opp-ch6-enjambre-mayor-v1', 9, 'trap-runtime-punish', 1);

-- Leviatán del Borde v1: control pesado del borde de la red
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch6-leviatan-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch6-leviatan-v1', 0, 'entity-cloudflare', 2),
  ('deck-opp-ch6-leviatan-v1', 1, 'entity-kubernetes', 2),
  ('deck-opp-ch6-leviatan-v1', 2, 'entity-linux', 2),
  ('deck-opp-ch6-leviatan-v1', 3, 'entity-rust', 2),
  ('deck-opp-ch6-leviatan-v1', 4, 'entity-hydra', 2),
  ('deck-opp-ch6-leviatan-v1', 5, 'exec-fusion-kuberlinnet', 1),
  ('deck-opp-ch6-leviatan-v1', 6, 'exec-firewall-fortress', 2),
  ('deck-opp-ch6-leviatan-v1', 7, 'exec-direct-damage-900', 2),
  ('deck-opp-ch6-leviatan-v1', 8, 'trap-hydra-counter', 2),
  ('deck-opp-ch6-leviatan-v1', 9, 'trap-nexus-reset-barrier', 1);

-- ── Duelos del capítulo 6 ────────────────────────────────────────────────────
insert into public.story_duels
  (id, chapter, duel_index, title, description, opponent_id, deck_list_id, opening_hand_size,
   starter_player, reward_nexus, reward_player_experience, unlock_requirement_duel_id, is_boss_duel, is_active)
values
  ('story-ch6-duel-1', 6, 1, 'Nimbus: Región Norte', 'El balanceador te cierra la plataforma norte. No estás en su tabla de rutas.',
   'opp-ch6-nimbus', 'deck-opp-ch6-nimbus-v1', 4, 'RANDOM', 1900, 940, 'story-ch5-duel-5', false, true),
  ('story-ch6-duel-2', 6, 2, 'Nimbus: Los Flujos', 'Otro nodo de Nimbus corta la plataforma este, justo antes de la corriente.',
   'opp-ch6-nimbus', 'deck-opp-ch6-nimbus-v1', 4, 'RANDOM', 2000, 960, 'story-ch5-duel-5', false, true),
  ('story-ch6-duel-3', 6, 3, 'Enjambre: La Plaza', 'Una copia degradada guarda la llave sur. Sabes que hay más mirando.',
   'opp-ch6-enjambre', 'deck-opp-ch6-enjambre-v1', 4, 'RANDOM', 2100, 1000, 'story-ch5-duel-5', false, true),
  ('story-ch6-duel-4', 6, 4, 'Enjambre Mayor', 'Cinco copias cierran el círculo, hablan a la vez y cuatro se apagan. La que queda pelea.',
   'opp-ch6-enjambre-mayor', 'deck-opp-ch6-enjambre-mayor-v1', 4, 'OPPONENT', 2400, 1150, 'story-ch6-duel-3', false, true),
  ('story-ch6-duel-5', 6, 5, 'Leviatán del Borde', 'El guardián de la salida de la red pública. Cierre del Acto 6.',
   'opp-ch6-leviatan', 'deck-opp-ch6-leviatan-v1', 4, 'OPPONENT', 3200, 1500, 'story-ch6-duel-4', true, true)
on conflict (id) do update set
  chapter = excluded.chapter, duel_index = excluded.duel_index, title = excluded.title, description = excluded.description,
  opponent_id = excluded.opponent_id, deck_list_id = excluded.deck_list_id, opening_hand_size = excluded.opening_hand_size,
  starter_player = excluded.starter_player, reward_nexus = excluded.reward_nexus,
  reward_player_experience = excluded.reward_player_experience, unlock_requirement_duel_id = excluded.unlock_requirement_duel_id,
  is_boss_duel = excluded.is_boss_duel, is_active = excluded.is_active, updated_at = now();

-- ── Dificultad por aparición (perfil de IA) ──────────────────────────────────
insert into public.story_duel_ai_profiles (duel_id, difficulty, ai_profile, is_active)
values
  ('story-ch6-duel-1', 'ELITE', '{"style":"control","aggression":0.70}'::jsonb, true),
  ('story-ch6-duel-2', 'ELITE', '{"style":"control","aggression":0.74}'::jsonb, true),
  ('story-ch6-duel-3', 'ELITE', '{"style":"aggressive","aggression":0.78}'::jsonb, true),
  ('story-ch6-duel-4', 'BOSS', '{"style":"aggressive","aggression":0.83}'::jsonb, true),
  ('story-ch6-duel-5', 'MYTHIC', '{"style":"control","aggression":0.87}'::jsonb, true)
on conflict (duel_id) do update set
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Escalado de mazo por duelo (nivel y tier de cada carta del rival) ────────
-- Del 78 al 86. Las tres regiones son simultáneas, así que los duelos 2 y 3 no encadenan requisito.
delete from public.story_duel_deck_overrides where duel_id in ('story-ch6-duel-1', 'story-ch6-duel-2', 'story-ch6-duel-3', 'story-ch6-duel-4', 'story-ch6-duel-5');
insert into public.story_duel_deck_overrides
  (duel_id, slot_index, card_id, copies, version_tier, level, xp, attack_override, defense_override, effect_override, is_active)
values
  ('story-ch6-duel-1', 0, 'entity-cloudflare', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 1, 'entity-aws', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 2, 'entity-digitalocean', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 3, 'entity-vercel', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 4, 'entity-hostinger', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 5, 'exec-firewall-fortress', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 6, 'exec-db-def-300', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 7, 'trap-firewall-counter-magic', 2, 3, 78, 0, null, null, null, true),
  ('story-ch6-duel-1', 8, 'trap-tor-smokescreen', 1, 3, 78, 0, null, null, null, true),

  ('story-ch6-duel-2', 0, 'entity-cloudflare', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 1, 'entity-aws', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 2, 'entity-digitalocean', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 3, 'entity-vercel', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 4, 'entity-hostinger', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 5, 'exec-firewall-fortress', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 6, 'exec-db-def-300', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 7, 'trap-firewall-counter-magic', 2, 3, 80, 0, null, null, null, true),
  ('story-ch6-duel-2', 8, 'trap-tor-smokescreen', 1, 3, 80, 0, null, null, null, true),

  ('story-ch6-duel-3', 0, 'entity-javascript', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 1, 'entity-python', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 2, 'entity-react', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 3, 'entity-vue', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 4, 'entity-svelte', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 5, 'exec-data-core-double-summon', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 6, 'exec-draw-1', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 7, 'exec-framework-atk-300', 2, 3, 82, 0, null, null, null, true),
  ('story-ch6-duel-3', 8, 'trap-def-fragment', 1, 3, 82, 0, null, null, null, true),

  ('story-ch6-duel-4', 0, 'entity-javascript', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 1, 'entity-typescript', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 2, 'entity-react', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 3, 'entity-nextjs', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 4, 'entity-hydra', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 5, 'exec-data-core-double-summon', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 6, 'exec-fusion-pytgress', 1, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 7, 'exec-direct-damage-600', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 8, 'trap-hydra-counter', 2, 4, 84, 0, null, null, null, true),
  ('story-ch6-duel-4', 9, 'trap-runtime-punish', 1, 4, 84, 0, null, null, null, true),

  ('story-ch6-duel-5', 0, 'entity-cloudflare', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 1, 'entity-kubernetes', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 2, 'entity-linux', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 3, 'entity-rust', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 4, 'entity-hydra', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 5, 'exec-fusion-kuberlinnet', 1, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 6, 'exec-firewall-fortress', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 7, 'exec-direct-damage-900', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 8, 'trap-hydra-counter', 2, 4, 86, 0, null, null, null, true),
  ('story-ch6-duel-5', 9, 'trap-nexus-reset-barrier', 1, 4, 86, 0, null, null, null, true);

-- ── Recompensas de carta garantizadas ────────────────────────────────────────
insert into public.story_duel_reward_cards (duel_id, card_id, copies, drop_rate, is_guaranteed)
values
  ('story-ch6-duel-3', 'fusion-curshost', 1, 1.0000, true),
  ('story-ch6-duel-5', 'entity-hydra', 1, 1.0000, true)
on conflict (duel_id, card_id) do update set
  copies = excluded.copies, drop_rate = excluded.drop_rate, is_guaranteed = excluded.is_guaranteed, updated_at = now();
