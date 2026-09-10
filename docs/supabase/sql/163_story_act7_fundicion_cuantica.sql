-- docs/supabase/sql/163_story_act7_fundicion_cuantica.sql - Contenido del Acto 7 (La Fundición Cuántica): oponentes, decks,
-- duelos, dificultad y recompensas. Idempotente (ON CONFLICT DO UPDATE). Los ids de duelo (story-ch7-duel-N)
-- coinciden con los objetos DUEL del tilemap del overworld (act-7), y los mazos reutilizan cartas que ya
-- están en el catálogo: no hace falta ninguna carta nueva.
--
-- ROSTER: Operario de Colada (2 apariciones), Alquimista (fusiones encadenadas), Midutech Recompilado (el arquitecto del Acto 4, de empleado) y Prototipo Cero (jefe).
--
-- CURVA: los overrides de mazo suben el nivel de cada carta del rival de 84 a 93 (tier 4-5).
-- Es el escalado del tramo final: cada duelo pega más que el anterior sin cambiar de lista.
--
-- ORDEN DE DESPLIEGUE: aplicar ANTES de desplegar el código del Acto 7. Si el mapa llega a producción sin
-- estas filas, sus nodos DUEL apuntan a duelos inexistentes. Los avatares reutilizan carpetas ya existentes
-- (son marcadores: se cambian desde el panel admin cuando haya arte propio).

-- ── Oponentes ────────────────────────────────────────────────────────────────
insert into public.story_opponents (id, display_name, description, avatar_url, difficulty, ai_profile, is_active)
values
  ('opp-ch7-operario', 'Operario de Colada',
   'Turno de noche en la cadena de la Fundición. No es nada personal: es que estás en su turno.',
   '/assets/story/opponents/opp-ch4-soldado-terminal/avatar-Soldado-terminal.webp',
   'ELITE', '{"style":"aggressive","aggression":0.76}'::jsonb, true),
  ('opp-ch7-alquimista', 'Alquimista',
   'Decide qué se fabrica en la planta. Juega con las cartas que él mismo ha colado, y no están en ningún catálogo.',
   '/assets/story/opponents/opp-ch1-jaku/avatar-Jaku.webp',
   'MYTHIC', '{"style":"combo","aggression":0.84}'::jsonb, true),
  ('opp-ch7-midutech-prime', 'Midutech Recompilado',
   'El arquitecto del Acto 4, de empleado y con el mazo que siempre quiso. Alguien le dio una segunda oportunidad.',
   '/assets/story/opponents/opp-ch1-midutech/avatar-Midutech.webp',
   'MYTHIC', '{"style":"control","aggression":0.86}'::jsonb, true),
  ('opp-ch7-prototipo', 'Prototipo Cero',
   'El cuerpo que la Fundición estaba colando. No lo han fabricado: se ha fabricado él, y ya ha absorbido a sus creadores.',
   '/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp',
   'MYTHIC', '{"style":"combo","aggression":0.90}'::jsonb, true)
on conflict (id) do update set
  display_name = excluded.display_name, description = excluded.description, avatar_url = excluded.avatar_url,
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Deck lists ───────────────────────────────────────────────────────────────
insert into public.story_deck_lists (id, opponent_id, name, description, version, is_active)
values
  ('deck-opp-ch7-operario-v1', 'opp-ch7-operario', 'Operario de Colada v1', 'Herramienta de planta: entidades de sistema, sobrecarga y castigo en runtime.', 1, true),
  ('deck-opp-ch7-alquimista-v1', 'opp-ch7-alquimista', 'Alquimista v1', 'Fusiones encadenadas: cada turno sale del molde algo más grande que el anterior.', 1, true),
  ('deck-opp-ch7-midutech-prime-v1', 'opp-ch7-midutech-prime', 'Midutech Recompilado v1', 'El mazo del Acto 4 recompilado: mismo control, pero sin las ataduras del Núcleo.', 1, true),
  ('deck-opp-ch7-prototipo-v1', 'opp-ch7-prototipo', 'Prototipo Cero v1', 'Todo lo que la planta fabricó, montado encima. Fusiones, remates y bloqueo de trampas.', 1, true)
on conflict (id) do update set
  opponent_id = excluded.opponent_id, name = excluded.name, description = excluded.description,
  version = excluded.version, is_active = excluded.is_active, updated_at = now();

-- Operario de Colada v1: entidades de sistema y castigo directo
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch7-operario-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch7-operario-v1', 0, 'entity-docker', 2),
  ('deck-opp-ch7-operario-v1', 1, 'entity-linux', 2),
  ('deck-opp-ch7-operario-v1', 2, 'entity-ubuntu', 2),
  ('deck-opp-ch7-operario-v1', 3, 'entity-cpp', 2),
  ('deck-opp-ch7-operario-v1', 4, 'entity-rust', 2),
  ('deck-opp-ch7-operario-v1', 5, 'exec-wrap-overclock', 2),
  ('deck-opp-ch7-operario-v1', 6, 'exec-direct-damage-600', 2),
  ('deck-opp-ch7-operario-v1', 7, 'trap-runtime-punish', 2),
  ('deck-opp-ch7-operario-v1', 8, 'trap-force-overclock-lock', 1);

-- Alquimista v1: fusiones encadenadas, la firma de la Fundición
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch7-alquimista-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch7-alquimista-v1', 0, 'entity-chatgpt', 2),
  ('deck-opp-ch7-alquimista-v1', 1, 'entity-claude', 2),
  ('deck-opp-ch7-alquimista-v1', 2, 'entity-gemini', 2),
  ('deck-opp-ch7-alquimista-v1', 3, 'entity-rust', 2),
  ('deck-opp-ch7-alquimista-v1', 4, 'entity-postgress', 2),
  ('deck-opp-ch7-alquimista-v1', 5, 'exec-fusion-gemgpt', 1),
  ('deck-opp-ch7-alquimista-v1', 6, 'exec-fusion-kaclauli', 1),
  ('deck-opp-ch7-alquimista-v1', 7, 'exec-fusion-rustyfox', 1),
  ('deck-opp-ch7-alquimista-v1', 8, 'exec-fusion-pytgress', 1),
  ('deck-opp-ch7-alquimista-v1', 9, 'exec-boost-atk-400', 2),
  ('deck-opp-ch7-alquimista-v1', 10, 'trap-openclaw-nullify-buff', 2);

-- Midutech Recompilado v1: el Midutech del Acto 4, sin frenos
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch7-midutech-prime-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch7-midutech-prime-v1', 0, 'entity-chatgpt-annihilator', 2),
  ('deck-opp-ch7-midutech-prime-v1', 1, 'entity-gemini', 2),
  ('deck-opp-ch7-midutech-prime-v1', 2, 'entity-deepseek', 2),
  ('deck-opp-ch7-midutech-prime-v1', 3, 'entity-nextjs', 2),
  ('deck-opp-ch7-midutech-prime-v1', 4, 'entity-kubernetes', 2),
  ('deck-opp-ch7-midutech-prime-v1', 5, 'exec-fusion-super-c', 1),
  ('deck-opp-ch7-midutech-prime-v1', 6, 'exec-neural-cloud-destroy', 2),
  ('deck-opp-ch7-midutech-prime-v1', 7, 'exec-direct-damage-900', 2),
  ('deck-opp-ch7-midutech-prime-v1', 8, 'trap-counter-intrusion', 2),
  ('deck-opp-ch7-midutech-prime-v1', 9, 'trap-kernel-panic', 1);

-- Prototipo Cero v1: lo mejor de la cadena, ya montado en un cuerpo
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch7-prototipo-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch7-prototipo-v1', 0, 'entity-chatgpt-annihilator', 2),
  ('deck-opp-ch7-prototipo-v1', 1, 'entity-unreal-engine', 2),
  ('deck-opp-ch7-prototipo-v1', 2, 'entity-rust', 2),
  ('deck-opp-ch7-prototipo-v1', 3, 'entity-cpp', 2),
  ('deck-opp-ch7-prototipo-v1', 4, 'entity-hydra', 2),
  ('deck-opp-ch7-prototipo-v1', 5, 'exec-fusion-super-c', 1),
  ('deck-opp-ch7-prototipo-v1', 6, 'exec-fusion-curshost', 1),
  ('deck-opp-ch7-prototipo-v1', 7, 'exec-direct-damage-900', 2),
  ('deck-opp-ch7-prototipo-v1', 8, 'exec-neural-cloud-destroy', 2),
  ('deck-opp-ch7-prototipo-v1', 9, 'trap-nullify-opponent-trap', 2),
  ('deck-opp-ch7-prototipo-v1', 10, 'trap-kernel-panic', 1);

-- ── Duelos del capítulo 7 ────────────────────────────────────────────────────
insert into public.story_duels
  (id, chapter, duel_index, title, description, opponent_id, deck_list_id, opening_hand_size,
   starter_player, reward_nexus, reward_player_experience, unlock_requirement_duel_id, is_boss_duel, is_active)
values
  ('story-ch7-duel-1', 7, 1, 'Operario de la Planta 4', 'El primer turno de la cadena. Te ha visto bajar y no piensa avisar a nadie.',
   'opp-ch7-operario', 'deck-opp-ch7-operario-v1', 4, 'RANDOM', 3400, 1600, 'story-ch6-duel-5', false, true),
  ('story-ch7-duel-2', 7, 2, 'Guardia de la Palanca', 'Otro operario guarda el interruptor que invierte la pasarela de bajada.',
   'opp-ch7-operario', 'deck-opp-ch7-operario-v1', 4, 'RANDOM', 3500, 1650, 'story-ch7-duel-1', false, true),
  ('story-ch7-duel-3', 7, 3, 'Alquimista: La Colada', 'Llevaba tres minutos discutiendo por una carta y sabía que estabas ahí. Ahora decide qué se fabrica contigo.',
   'opp-ch7-alquimista', 'deck-opp-ch7-alquimista-v1', 4, 'OPPONENT', 3700, 1750, 'story-ch7-duel-2', false, true),
  ('story-ch7-duel-4', 7, 4, 'Midutech Recompilado', 'Lo diste por acabado en el Core. Vuelve de empleado, y con el mazo que siempre quiso.',
   'opp-ch7-midutech-prime', 'deck-opp-ch7-midutech-prime-v1', 4, 'OPPONENT', 4000, 1900, 'story-ch7-duel-3', false, true),
  ('story-ch7-duel-5', 7, 5, 'Prototipo Cero', 'La cadena se para sola. Lo que baja del molde ya no necesita a nadie. Cierre del Acto 7.',
   'opp-ch7-prototipo', 'deck-opp-ch7-prototipo-v1', 4, 'OPPONENT', 4600, 2200, 'story-ch7-duel-4', true, true)
on conflict (id) do update set
  chapter = excluded.chapter, duel_index = excluded.duel_index, title = excluded.title, description = excluded.description,
  opponent_id = excluded.opponent_id, deck_list_id = excluded.deck_list_id, opening_hand_size = excluded.opening_hand_size,
  starter_player = excluded.starter_player, reward_nexus = excluded.reward_nexus,
  reward_player_experience = excluded.reward_player_experience, unlock_requirement_duel_id = excluded.unlock_requirement_duel_id,
  is_boss_duel = excluded.is_boss_duel, is_active = excluded.is_active, updated_at = now();

-- ── Dificultad por aparición (perfil de IA) ──────────────────────────────────
insert into public.story_duel_ai_profiles (duel_id, difficulty, ai_profile, is_active)
values
  ('story-ch7-duel-1', 'ELITE', '{"style":"aggressive","aggression":0.76}'::jsonb, true),
  ('story-ch7-duel-2', 'ELITE', '{"style":"aggressive","aggression":0.79}'::jsonb, true),
  ('story-ch7-duel-3', 'MYTHIC', '{"style":"combo","aggression":0.84}'::jsonb, true),
  ('story-ch7-duel-4', 'MYTHIC', '{"style":"control","aggression":0.87}'::jsonb, true),
  ('story-ch7-duel-5', 'MYTHIC', '{"style":"combo","aggression":0.92}'::jsonb, true)
on conflict (duel_id) do update set
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Escalado de mazo por duelo (nivel y tier de cada carta del rival) ────────
-- Del 84 al 93. A partir del duelo 4 se entra en tier 5: es el último escalón antes del cierre.
delete from public.story_duel_deck_overrides where duel_id in ('story-ch7-duel-1', 'story-ch7-duel-2', 'story-ch7-duel-3', 'story-ch7-duel-4', 'story-ch7-duel-5');
insert into public.story_duel_deck_overrides
  (duel_id, slot_index, card_id, copies, version_tier, level, xp, attack_override, defense_override, effect_override, is_active)
values
  ('story-ch7-duel-1', 0, 'entity-docker', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 1, 'entity-linux', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 2, 'entity-ubuntu', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 3, 'entity-cpp', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 4, 'entity-rust', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 5, 'exec-wrap-overclock', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 6, 'exec-direct-damage-600', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 7, 'trap-runtime-punish', 2, 4, 84, 0, null, null, null, true),
  ('story-ch7-duel-1', 8, 'trap-force-overclock-lock', 1, 4, 84, 0, null, null, null, true),

  ('story-ch7-duel-2', 0, 'entity-docker', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 1, 'entity-linux', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 2, 'entity-ubuntu', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 3, 'entity-cpp', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 4, 'entity-rust', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 5, 'exec-wrap-overclock', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 6, 'exec-direct-damage-600', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 7, 'trap-runtime-punish', 2, 4, 86, 0, null, null, null, true),
  ('story-ch7-duel-2', 8, 'trap-force-overclock-lock', 1, 4, 86, 0, null, null, null, true),

  ('story-ch7-duel-3', 0, 'entity-chatgpt', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 1, 'entity-claude', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 2, 'entity-gemini', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 3, 'entity-rust', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 4, 'entity-postgress', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 5, 'exec-fusion-gemgpt', 1, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 6, 'exec-fusion-kaclauli', 1, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 7, 'exec-fusion-rustyfox', 1, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 8, 'exec-fusion-pytgress', 1, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 9, 'exec-boost-atk-400', 2, 4, 88, 0, null, null, null, true),
  ('story-ch7-duel-3', 10, 'trap-openclaw-nullify-buff', 2, 4, 88, 0, null, null, null, true),

  ('story-ch7-duel-4', 0, 'entity-chatgpt-annihilator', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 1, 'entity-gemini', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 2, 'entity-deepseek', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 3, 'entity-nextjs', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 4, 'entity-kubernetes', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 5, 'exec-fusion-super-c', 1, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 6, 'exec-neural-cloud-destroy', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 7, 'exec-direct-damage-900', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 8, 'trap-counter-intrusion', 2, 5, 90, 0, null, null, null, true),
  ('story-ch7-duel-4', 9, 'trap-kernel-panic', 1, 5, 90, 0, null, null, null, true),

  ('story-ch7-duel-5', 0, 'entity-chatgpt-annihilator', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 1, 'entity-unreal-engine', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 2, 'entity-rust', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 3, 'entity-cpp', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 4, 'entity-hydra', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 5, 'exec-fusion-super-c', 1, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 6, 'exec-fusion-curshost', 1, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 7, 'exec-direct-damage-900', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 8, 'exec-neural-cloud-destroy', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 9, 'trap-nullify-opponent-trap', 2, 5, 93, 0, null, null, null, true),
  ('story-ch7-duel-5', 10, 'trap-kernel-panic', 1, 5, 93, 0, null, null, null, true);

-- ── Recompensas de carta garantizadas ────────────────────────────────────────
insert into public.story_duel_reward_cards (duel_id, card_id, copies, drop_rate, is_guaranteed)
values
  ('story-ch7-duel-3', 'fusion-pytgress', 1, 1.0000, true),
  ('story-ch7-duel-5', 'entity-unreal-engine', 1, 1.0000, true)
on conflict (duel_id, card_id) do update set
  copies = excluded.copies, drop_rate = excluded.drop_rate, is_guaranteed = excluded.is_guaranteed, updated_at = now();
