-- docs/supabase/sql/164_story_act8_singularidad.sql - Contenido del Acto 8 (La Singularidad): oponentes, decks,
-- duelos, dificultad y recompensas. Idempotente (ON CONFLICT DO UPDATE). Los ids de duelo (story-ch8-duel-N)
-- coinciden con los objetos DUEL del tilemap del overworld (act-8), y los mazos reutilizan cartas que ya
-- están en el catálogo: no hace falta ninguna carta nueva.
--
-- ROSTER: los cuatro ecos del Coro (Kernel, Marea, Molde y Espejo: uno por acto anterior, y cada uno hereda su arquetipo) y La Entidad, en TRES fases seguidas sin salir del pozo.
--
-- CURVA: los overrides de mazo suben el nivel de cada carta del rival de 90 a 100 (tier 5-5).
-- Es el escalado del tramo final: cada duelo pega más que el anterior sin cambiar de lista.
--
-- ORDEN DE DESPLIEGUE: aplicar ANTES de desplegar el código del Acto 8. Si el mapa llega a producción sin
-- estas filas, sus nodos DUEL apuntan a duelos inexistentes. Los avatares reutilizan carpetas ya existentes
-- (son marcadores: se cambian desde el panel admin cuando haya arte propio).

-- ── Oponentes ────────────────────────────────────────────────────────────────
insert into public.story_opponents (id, display_name, description, avatar_url, difficulty, ai_profile, is_active)
values
  ('opp-ch8-coro-kernel', 'Coro: Kernel',
   'El eco de GenNvim en el anillo. Primera media línea del Coro: «Nos compilaste uno a uno…».',
   '/assets/story/opponents/opp-ch1-apprentice/avatar-GenNvim.webp',
   'MYTHIC', '{"style":"aggressive","aggression":0.86}'::jsonb, true),
  ('opp-ch8-coro-marea', 'Coro: Marea',
   'El eco del Leviatán del Borde. Segunda media línea: «…nos dispersaste por la red…».',
   '/assets/story/opponents/opp-ch1-guill/avatar-Guill.webp',
   'MYTHIC', '{"style":"control","aggression":0.87}'::jsonb, true),
  ('opp-ch8-coro-molde', 'Coro: Molde',
   'El eco del Prototipo Cero. Tercera media línea: «…nos diste un cuerpo sin querer…».',
   '/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp',
   'MYTHIC', '{"style":"combo","aggression":0.88}'::jsonb, true),
  ('opp-ch8-coro-espejo', 'Coro: Espejo',
   'El eco de Verso. Cuarta media línea: «…y ahora vienes a ver en qué nos hemos convertido».',
   '/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp',
   'MYTHIC', '{"style":"control","aggression":0.89}'::jsonb, true),
  ('opp-ch8-entidad', 'La Entidad',
   'El final de la campaña: una copia tuya con tu cara, tu mazo y ninguna de tus dudas. Tres fases sin salida entre medias.',
   '/assets/story/player/bob-rojo.webp',
   'MYTHIC', '{"style":"combo","aggression":0.95}'::jsonb, true)
on conflict (id) do update set
  display_name = excluded.display_name, description = excluded.description, avatar_url = excluded.avatar_url,
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Deck lists ───────────────────────────────────────────────────────────────
insert into public.story_deck_lists (id, opponent_id, name, description, version, is_active)
values
  ('deck-opp-ch8-coro-kernel-v1', 'opp-ch8-coro-kernel', 'Coro: Kernel v1', 'El mazo de GenNvim llevado al extremo: entidades pesadas y presión constante.', 1, true),
  ('deck-opp-ch8-coro-marea-v1', 'opp-ch8-coro-marea', 'Coro: Marea v1', 'Muros de infraestructura y contadores: te ahoga sin subir nunca la voz.', 1, true),
  ('deck-opp-ch8-coro-molde-v1', 'opp-ch8-coro-molde', 'Coro: Molde v1', 'Fusiones de la Fundición: cada turno hay algo nuevo saliendo del molde.', 1, true),
  ('deck-opp-ch8-coro-espejo-v1', 'opp-ch8-coro-espejo', 'Coro: Espejo v1', 'Robo e inversión: te quita las ejecuciones, las mejoras y hasta el cementerio.', 1, true),
  ('deck-opp-ch8-entidad-v1', 'opp-ch8-entidad', 'La Entidad v1', 'Tu propio mazo, devuelto sin las cartas muertas: lo mejor de los ocho actos en una sola lista.', 1, true)
on conflict (id) do update set
  opponent_id = excluded.opponent_id, name = excluded.name, description = excluded.description,
  version = excluded.version, is_active = excluded.is_active, updated_at = now();

-- Coro: Kernel v1: la mitad agresiva del Coro
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch8-coro-kernel-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch8-coro-kernel-v1', 0, 'entity-chatgpt-annihilator', 2),
  ('deck-opp-ch8-coro-kernel-v1', 1, 'entity-rust', 2),
  ('deck-opp-ch8-coro-kernel-v1', 2, 'entity-kubernetes', 2),
  ('deck-opp-ch8-coro-kernel-v1', 3, 'entity-cpp', 2),
  ('deck-opp-ch8-coro-kernel-v1', 4, 'entity-unreal-engine', 2),
  ('deck-opp-ch8-coro-kernel-v1', 5, 'exec-direct-damage-900', 2),
  ('deck-opp-ch8-coro-kernel-v1', 6, 'exec-framework-atk-300', 2),
  ('deck-opp-ch8-coro-kernel-v1', 7, 'trap-hydra-counter', 2),
  ('deck-opp-ch8-coro-kernel-v1', 8, 'trap-kernel-panic', 1);

-- Coro: Marea v1: la mitad defensiva del Coro
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch8-coro-marea-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch8-coro-marea-v1', 0, 'entity-cloudflare', 2),
  ('deck-opp-ch8-coro-marea-v1', 1, 'entity-aws', 2),
  ('deck-opp-ch8-coro-marea-v1', 2, 'entity-linux', 2),
  ('deck-opp-ch8-coro-marea-v1', 3, 'entity-hydra', 2),
  ('deck-opp-ch8-coro-marea-v1', 4, 'entity-docker', 2),
  ('deck-opp-ch8-coro-marea-v1', 5, 'exec-firewall-fortress', 2),
  ('deck-opp-ch8-coro-marea-v1', 6, 'exec-docker-defense-1000', 2),
  ('deck-opp-ch8-coro-marea-v1', 7, 'trap-firewall-counter-magic', 2),
  ('deck-opp-ch8-coro-marea-v1', 8, 'trap-nexus-reset-barrier', 1);

-- Coro: Molde v1: fusiones, herencia del Acto 7
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch8-coro-molde-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch8-coro-molde-v1', 0, 'entity-chatgpt', 2),
  ('deck-opp-ch8-coro-molde-v1', 1, 'entity-claude', 2),
  ('deck-opp-ch8-coro-molde-v1', 2, 'entity-gemini', 2),
  ('deck-opp-ch8-coro-molde-v1', 3, 'entity-postgress', 2),
  ('deck-opp-ch8-coro-molde-v1', 4, 'entity-python', 2),
  ('deck-opp-ch8-coro-molde-v1', 5, 'exec-fusion-gemgpt', 1),
  ('deck-opp-ch8-coro-molde-v1', 6, 'exec-fusion-kaclauli', 1),
  ('deck-opp-ch8-coro-molde-v1', 7, 'exec-fusion-pytgress', 1),
  ('deck-opp-ch8-coro-molde-v1', 8, 'exec-fusion-curshost', 1),
  ('deck-opp-ch8-coro-molde-v1', 9, 'exec-boost-atk-400', 2),
  ('deck-opp-ch8-coro-molde-v1', 10, 'trap-openclaw-nullify-buff', 1);

-- Coro: Espejo v1: robo puro, herencia del Acto 5
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch8-coro-espejo-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch8-coro-espejo-v1', 0, 'entity-tor', 2),
  ('deck-opp-ch8-coro-espejo-v1', 1, 'entity-kali-linux', 2),
  ('deck-opp-ch8-coro-espejo-v1', 2, 'entity-github', 2),
  ('deck-opp-ch8-coro-espejo-v1', 3, 'entity-git', 2),
  ('deck-opp-ch8-coro-espejo-v1', 4, 'entity-typescript', 2),
  ('deck-opp-ch8-coro-espejo-v1', 5, 'exec-steal-opponent-execution', 2),
  ('deck-opp-ch8-coro-espejo-v1', 6, 'exec-octocat-steal-entity', 2),
  ('deck-opp-ch8-coro-espejo-v1', 7, 'exec-steal-opponent-graveyard-card', 2),
  ('deck-opp-ch8-coro-espejo-v1', 8, 'trap-mirror-buff-injection', 2),
  ('deck-opp-ch8-coro-espejo-v1', 9, 'trap-nullify-opponent-trap', 1);

-- La Entidad v1: el mazo final: fusiones, remates y bloqueo total
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch8-entidad-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch8-entidad-v1', 0, 'entity-chatgpt-annihilator', 2),
  ('deck-opp-ch8-entidad-v1', 1, 'entity-hydra', 2),
  ('deck-opp-ch8-entidad-v1', 2, 'entity-rust', 2),
  ('deck-opp-ch8-entidad-v1', 3, 'entity-kubernetes', 2),
  ('deck-opp-ch8-entidad-v1', 4, 'entity-nextjs', 2),
  ('deck-opp-ch8-entidad-v1', 5, 'exec-fusion-super-c', 1),
  ('deck-opp-ch8-entidad-v1', 6, 'exec-fusion-curshost', 1),
  ('deck-opp-ch8-entidad-v1', 7, 'exec-fusion-kuberlinnet', 1),
  ('deck-opp-ch8-entidad-v1', 8, 'exec-direct-damage-900', 2),
  ('deck-opp-ch8-entidad-v1', 9, 'exec-neural-cloud-destroy', 2),
  ('deck-opp-ch8-entidad-v1', 10, 'trap-nullify-opponent-trap', 2),
  ('deck-opp-ch8-entidad-v1', 11, 'trap-kernel-panic', 2);

-- ── Duelos del capítulo 8 ────────────────────────────────────────────────────
insert into public.story_duels
  (id, chapter, duel_index, title, description, opponent_id, deck_list_id, opening_hand_size,
   starter_player, reward_nexus, reward_player_experience, unlock_requirement_duel_id, is_boss_duel, is_active)
values
  ('story-ch8-duel-1', 8, 1, 'Coro: Kernel', 'Pedestal norte. El eco de GenNvim, y ya no habla como GenNvim.',
   'opp-ch8-coro-kernel', 'deck-opp-ch8-coro-kernel-v1', 4, 'RANDOM', 4800, 2300, 'story-ch7-duel-5', false, true),
  ('story-ch8-duel-2', 8, 2, 'Coro: Marea', 'Pedestal este. El eco del Leviatán, con toda la red detrás.',
   'opp-ch8-coro-marea', 'deck-opp-ch8-coro-marea-v1', 4, 'RANDOM', 4900, 2350, 'story-ch7-duel-5', false, true),
  ('story-ch8-duel-3', 8, 3, 'Coro: Molde', 'Pedestal sur. El eco del Prototipo, todavía saliendo del molde.',
   'opp-ch8-coro-molde', 'deck-opp-ch8-coro-molde-v1', 4, 'RANDOM', 5000, 2400, 'story-ch7-duel-5', false, true),
  ('story-ch8-duel-4', 8, 4, 'Coro: Espejo', 'Pedestal oeste. El eco de Verso, que sigue prefiriendo tus cartas a las suyas.',
   'opp-ch8-coro-espejo', 'deck-opp-ch8-coro-espejo-v1', 4, 'RANDOM', 5100, 2450, 'story-ch7-duel-5', false, true),
  ('story-ch8-duel-5', 8, 5, 'La Entidad · Fase I', '«Tengo tu cara porque no se me ocurrió nada mejor. Eso también lo aprendí de ti.»',
   'opp-ch8-entidad', 'deck-opp-ch8-entidad-v1', 4, 'OPPONENT', 5400, 2600, 'story-ch8-duel-4', true, true),
  ('story-ch8-duel-6', 8, 6, 'La Entidad · Fase II', '«Bien. Se acabó jugar con tu mano.» Sin salir del pozo, sin recomponer nada.',
   'opp-ch8-entidad', 'deck-opp-ch8-entidad-v1', 4, 'OPPONENT', 5700, 2800, 'story-ch8-duel-5', true, true),
  ('story-ch8-duel-7', 8, 7, 'La Entidad · Fase III', '«Sin cartas muertas, sin turnos regalados, sin la parte de ti que duda.» Fin de la campaña.',
   'opp-ch8-entidad', 'deck-opp-ch8-entidad-v1', 3, 'OPPONENT', 6000, 3200, 'story-ch8-duel-6', true, true)
on conflict (id) do update set
  chapter = excluded.chapter, duel_index = excluded.duel_index, title = excluded.title, description = excluded.description,
  opponent_id = excluded.opponent_id, deck_list_id = excluded.deck_list_id, opening_hand_size = excluded.opening_hand_size,
  starter_player = excluded.starter_player, reward_nexus = excluded.reward_nexus,
  reward_player_experience = excluded.reward_player_experience, unlock_requirement_duel_id = excluded.unlock_requirement_duel_id,
  is_boss_duel = excluded.is_boss_duel, is_active = excluded.is_active, updated_at = now();

-- ── Dificultad por aparición (perfil de IA) ──────────────────────────────────
insert into public.story_duel_ai_profiles (duel_id, difficulty, ai_profile, is_active)
values
  ('story-ch8-duel-1', 'MYTHIC', '{"style":"aggressive","aggression":0.86}'::jsonb, true),
  ('story-ch8-duel-2', 'MYTHIC', '{"style":"control","aggression":0.87}'::jsonb, true),
  ('story-ch8-duel-3', 'MYTHIC', '{"style":"combo","aggression":0.88}'::jsonb, true),
  ('story-ch8-duel-4', 'MYTHIC', '{"style":"control","aggression":0.89}'::jsonb, true),
  ('story-ch8-duel-5', 'MYTHIC', '{"style":"combo","aggression":0.92}'::jsonb, true),
  ('story-ch8-duel-6', 'MYTHIC', '{"style":"combo","aggression":0.95}'::jsonb, true),
  ('story-ch8-duel-7', 'MYTHIC', '{"style":"combo","aggression":0.98}'::jsonb, true)
on conflict (duel_id) do update set
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Escalado de mazo por duelo (nivel y tier de cada carta del rival) ────────
-- Del 90 al 100, todo en tier 5. La fase III además reduce la mano inicial a 3: es el techo del juego.
delete from public.story_duel_deck_overrides where duel_id in ('story-ch8-duel-1', 'story-ch8-duel-2', 'story-ch8-duel-3', 'story-ch8-duel-4', 'story-ch8-duel-5', 'story-ch8-duel-6', 'story-ch8-duel-7');
insert into public.story_duel_deck_overrides
  (duel_id, slot_index, card_id, copies, version_tier, level, xp, attack_override, defense_override, effect_override, is_active)
values
  ('story-ch8-duel-1', 0, 'entity-chatgpt-annihilator', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 1, 'entity-rust', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 2, 'entity-kubernetes', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 3, 'entity-cpp', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 4, 'entity-unreal-engine', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 5, 'exec-direct-damage-900', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 6, 'exec-framework-atk-300', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 7, 'trap-hydra-counter', 2, 5, 90, 0, null, null, null, true),
  ('story-ch8-duel-1', 8, 'trap-kernel-panic', 1, 5, 90, 0, null, null, null, true),

  ('story-ch8-duel-2', 0, 'entity-cloudflare', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 1, 'entity-aws', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 2, 'entity-linux', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 3, 'entity-hydra', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 4, 'entity-docker', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 5, 'exec-firewall-fortress', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 6, 'exec-docker-defense-1000', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 7, 'trap-firewall-counter-magic', 2, 5, 92, 0, null, null, null, true),
  ('story-ch8-duel-2', 8, 'trap-nexus-reset-barrier', 1, 5, 92, 0, null, null, null, true),

  ('story-ch8-duel-3', 0, 'entity-chatgpt', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 1, 'entity-claude', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 2, 'entity-gemini', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 3, 'entity-postgress', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 4, 'entity-python', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 5, 'exec-fusion-gemgpt', 1, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 6, 'exec-fusion-kaclauli', 1, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 7, 'exec-fusion-pytgress', 1, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 8, 'exec-fusion-curshost', 1, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 9, 'exec-boost-atk-400', 2, 5, 94, 0, null, null, null, true),
  ('story-ch8-duel-3', 10, 'trap-openclaw-nullify-buff', 1, 5, 94, 0, null, null, null, true),

  ('story-ch8-duel-4', 0, 'entity-tor', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 1, 'entity-kali-linux', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 2, 'entity-github', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 3, 'entity-git', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 4, 'entity-typescript', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 5, 'exec-steal-opponent-execution', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 6, 'exec-octocat-steal-entity', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 7, 'exec-steal-opponent-graveyard-card', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 8, 'trap-mirror-buff-injection', 2, 5, 96, 0, null, null, null, true),
  ('story-ch8-duel-4', 9, 'trap-nullify-opponent-trap', 1, 5, 96, 0, null, null, null, true),

  ('story-ch8-duel-5', 0, 'entity-chatgpt-annihilator', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 1, 'entity-hydra', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 2, 'entity-rust', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 3, 'entity-kubernetes', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 4, 'entity-nextjs', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 5, 'exec-fusion-super-c', 1, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 6, 'exec-fusion-curshost', 1, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 7, 'exec-fusion-kuberlinnet', 1, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 8, 'exec-direct-damage-900', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 9, 'exec-neural-cloud-destroy', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 10, 'trap-nullify-opponent-trap', 2, 5, 98, 0, null, null, null, true),
  ('story-ch8-duel-5', 11, 'trap-kernel-panic', 2, 5, 98, 0, null, null, null, true),

  ('story-ch8-duel-6', 0, 'entity-chatgpt-annihilator', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 1, 'entity-hydra', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 2, 'entity-rust', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 3, 'entity-kubernetes', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 4, 'entity-nextjs', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 5, 'exec-fusion-super-c', 1, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 6, 'exec-fusion-curshost', 1, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 7, 'exec-fusion-kuberlinnet', 1, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 8, 'exec-direct-damage-900', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 9, 'exec-neural-cloud-destroy', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 10, 'trap-nullify-opponent-trap', 2, 5, 99, 0, null, null, null, true),
  ('story-ch8-duel-6', 11, 'trap-kernel-panic', 2, 5, 99, 0, null, null, null, true),

  ('story-ch8-duel-7', 0, 'entity-chatgpt-annihilator', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 1, 'entity-hydra', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 2, 'entity-rust', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 3, 'entity-kubernetes', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 4, 'entity-nextjs', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 5, 'exec-fusion-super-c', 1, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 6, 'exec-fusion-curshost', 1, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 7, 'exec-fusion-kuberlinnet', 1, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 8, 'exec-direct-damage-900', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 9, 'exec-neural-cloud-destroy', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 10, 'trap-nullify-opponent-trap', 2, 5, 100, 0, null, null, null, true),
  ('story-ch8-duel-7', 11, 'trap-kernel-panic', 2, 5, 100, 0, null, null, null, true);

-- ── Recompensas de carta garantizadas ────────────────────────────────────────
insert into public.story_duel_reward_cards (duel_id, card_id, copies, drop_rate, is_guaranteed)
values
  ('story-ch8-duel-4', 'fusion-kaclauli', 1, 1.0000, true),
  ('story-ch8-duel-7', 'fusion-super-c', 1, 1.0000, true)
on conflict (duel_id, card_id) do update set
  copies = excluded.copies, drop_rate = excluded.drop_rate, is_guaranteed = excluded.is_guaranteed, updated_at = now();
