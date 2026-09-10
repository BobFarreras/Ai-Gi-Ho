-- docs/supabase/sql/161_story_act5_core_invertido.sql - Contenido del Acto 5 (El Core Invertido): oponentes, decks,
-- duelos, dificultad y recompensas. Idempotente (ON CONFLICT DO UPDATE). Los ids de duelo (story-ch5-duel-N)
-- coinciden con los objetos DUEL del tilemap del overworld (act-5), y los mazos reutilizan cartas que ya
-- están en el catálogo: no hace falta ninguna carta nueva.
--
-- ROSTER: Eco (3 apariciones, copia tu propio mazo), Verso (la mitad que roba e invierte) y El Reflejo (jefe: las dos mitades a la vez).
--
-- CURVA: los overrides de mazo suben el nivel de cada carta del rival de 72 a 80 (tier 2-3).
-- Es el escalado del tramo final: cada duelo pega más que el anterior sin cambiar de lista.
--
-- ORDEN DE DESPLIEGUE: aplicar ANTES de desplegar el código del Acto 5. Si el mapa llega a producción sin
-- estas filas, sus nodos DUEL apuntan a duelos inexistentes. Los avatares reutilizan carpetas ya existentes
-- (son marcadores: se cambian desde el panel admin cuando haya arte propio).

-- ── Oponentes ────────────────────────────────────────────────────────────────
insert into public.story_opponents (id, display_name, description, avatar_url, difficulty, ai_profile, is_active)
values
  ('opp-ch5-eco', 'Eco',
   'Copia degradada del Operador que el Core dejó suelta por los pasillos. Repite tus jugadas con un compás de retraso.',
   '/assets/story/opponents/opp-ch1-soldier-act01/avatar-Soldado-act01.webp',
   'ELITE', '{"style":"aggressive","aggression":0.68}'::jsonb, true),
  ('opp-ch5-verso', 'Verso',
   'La otra mitad del espejo: no copia, invierte. Roba, intercambia y te devuelve tus propias cartas del revés.',
   '/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp',
   'ELITE', '{"style":"control","aggression":0.72}'::jsonb, true),
  ('opp-ch5-reflejo', 'El Reflejo',
   'El guardián del trono vacío. Tiene tus cartas, tus tiempos y tus manías; lo único que no tiene son tus motivos.',
   '/assets/story/opponents/opp-ch1-apprentice/avatar-GenNvim.webp',
   'BOSS', '{"style":"combo","aggression":0.82}'::jsonb, true)
on conflict (id) do update set
  display_name = excluded.display_name, description = excluded.description, avatar_url = excluded.avatar_url,
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Deck lists ───────────────────────────────────────────────────────────────
insert into public.story_deck_lists (id, opponent_id, name, description, version, is_active)
values
  ('deck-opp-ch5-eco-v1', 'opp-ch5-eco', 'Eco v1', 'La baraja del propio jugador, mal copiada: lo mismo pero un punto peor.', 1, true),
  ('deck-opp-ch5-verso-v1', 'opp-ch5-verso', 'Verso v1', 'Todo lo que hace es quitarte algo y usarlo: robo de ejecuciones, entidades y cementerio.', 1, true),
  ('deck-opp-ch5-reflejo-v1', 'opp-ch5-reflejo', 'El Reflejo v1', 'Las dos mitades a la vez: copia tus mejoras y te roba lo que te queda.', 1, true)
on conflict (id) do update set
  opponent_id = excluded.opponent_id, name = excluded.name, description = excluded.description,
  version = excluded.version, is_active = excluded.is_active, updated_at = now();

-- Eco v1: tu mazo de siempre, copiado de memoria
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch5-eco-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch5-eco-v1', 0, 'entity-python', 2),
  ('deck-opp-ch5-eco-v1', 1, 'entity-react', 2),
  ('deck-opp-ch5-eco-v1', 2, 'entity-typescript', 2),
  ('deck-opp-ch5-eco-v1', 3, 'entity-supabase', 2),
  ('deck-opp-ch5-eco-v1', 4, 'entity-postgress', 2),
  ('deck-opp-ch5-eco-v1', 5, 'exec-draw-1', 2),
  ('deck-opp-ch5-eco-v1', 6, 'exec-boost-atk-400', 2),
  ('deck-opp-ch5-eco-v1', 7, 'trap-mirror-buff-injection', 2),
  ('deck-opp-ch5-eco-v1', 8, 'trap-atk-drain', 1);

-- Verso v1: control por robo, nada de fuerza bruta
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch5-verso-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch5-verso-v1', 0, 'entity-tor', 2),
  ('deck-opp-ch5-verso-v1', 1, 'entity-kali-linux', 2),
  ('deck-opp-ch5-verso-v1', 2, 'entity-github', 2),
  ('deck-opp-ch5-verso-v1', 3, 'entity-git', 2),
  ('deck-opp-ch5-verso-v1', 4, 'exec-steal-opponent-execution', 2),
  ('deck-opp-ch5-verso-v1', 5, 'exec-octocat-steal-entity', 2),
  ('deck-opp-ch5-verso-v1', 6, 'exec-steal-opponent-graveyard-card', 2),
  ('deck-opp-ch5-verso-v1', 7, 'exec-terminal-hand-swap', 1),
  ('deck-opp-ch5-verso-v1', 8, 'trap-nullify-opponent-trap', 2),
  ('deck-opp-ch5-verso-v1', 9, 'trap-counter-intrusion', 1);

-- El Reflejo v1: copia + robo, con fusiones para rematar
delete from public.story_deck_list_cards where deck_list_id = 'deck-opp-ch5-reflejo-v1';
insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies) values
  ('deck-opp-ch5-reflejo-v1', 0, 'entity-chatgpt', 2),
  ('deck-opp-ch5-reflejo-v1', 1, 'entity-claude', 2),
  ('deck-opp-ch5-reflejo-v1', 2, 'entity-rust', 2),
  ('deck-opp-ch5-reflejo-v1', 3, 'entity-kubernetes', 2),
  ('deck-opp-ch5-reflejo-v1', 4, 'entity-nextjs', 2),
  ('deck-opp-ch5-reflejo-v1', 5, 'exec-fusion-kaclauli', 1),
  ('deck-opp-ch5-reflejo-v1', 6, 'exec-fusion-rustyfox', 1),
  ('deck-opp-ch5-reflejo-v1', 7, 'exec-steal-opponent-execution', 2),
  ('deck-opp-ch5-reflejo-v1', 8, 'exec-direct-damage-900', 2),
  ('deck-opp-ch5-reflejo-v1', 9, 'trap-mirror-buff-injection', 2),
  ('deck-opp-ch5-reflejo-v1', 10, 'trap-kernel-panic', 1);

-- ── Duelos del capítulo 5 ────────────────────────────────────────────────────
insert into public.story_duels
  (id, chapter, duel_index, title, description, opponent_id, deck_list_id, opening_hand_size,
   starter_player, reward_nexus, reward_player_experience, unlock_requirement_duel_id, is_boss_duel, is_active)
values
  ('story-ch5-duel-1', 5, 1, 'Eco del Corredor', 'Un Eco planta cara en la boca del Core y te suelta una frase que no es suya.',
   'opp-ch5-eco', 'deck-opp-ch5-eco-v1', 4, 'RANDOM', 800, 420, 'story-ch4-duel-7', false, true),
  ('story-ch5-duel-2', 5, 2, 'Eco del Ala Izquierda', 'Un Eco patrulla el ala oeste, entre la caja y la placa.',
   'opp-ch5-eco', 'deck-opp-ch5-eco-v1', 4, 'RANDOM', 860, 440, 'story-ch5-duel-1', false, true),
  ('story-ch5-duel-3', 5, 3, 'Eco del Ala Derecha', 'El mismo Eco, la misma patrulla, en espejo. Aquí ya sabe lo que vas a hacer.',
   'opp-ch5-eco', 'deck-opp-ch5-eco-v1', 4, 'RANDOM', 920, 460, 'story-ch5-duel-2', false, true),
  ('story-ch5-duel-4', 5, 4, 'Verso: La Mitad Que Cambia', 'Detrás del doble estaba Verso desde el principio. Cruza la línea de espejos y baja a por ti.',
   'opp-ch5-verso', 'deck-opp-ch5-verso-v1', 4, 'OPPONENT', 1100, 520, 'story-ch5-duel-3', false, true),
  ('story-ch5-duel-5', 5, 5, 'El Reflejo: El Trono Vacío', 'El guardián de una casa que su señor ya ha abandonado. Cierre del Acto 5.',
   'opp-ch5-reflejo', 'deck-opp-ch5-reflejo-v1', 4, 'OPPONENT', 1800, 900, 'story-ch5-duel-4', true, true)
on conflict (id) do update set
  chapter = excluded.chapter, duel_index = excluded.duel_index, title = excluded.title, description = excluded.description,
  opponent_id = excluded.opponent_id, deck_list_id = excluded.deck_list_id, opening_hand_size = excluded.opening_hand_size,
  starter_player = excluded.starter_player, reward_nexus = excluded.reward_nexus,
  reward_player_experience = excluded.reward_player_experience, unlock_requirement_duel_id = excluded.unlock_requirement_duel_id,
  is_boss_duel = excluded.is_boss_duel, is_active = excluded.is_active, updated_at = now();

-- ── Dificultad por aparición (perfil de IA) ──────────────────────────────────
insert into public.story_duel_ai_profiles (duel_id, difficulty, ai_profile, is_active)
values
  ('story-ch5-duel-1', 'ELITE', '{"style":"aggressive","aggression":0.66}'::jsonb, true),
  ('story-ch5-duel-2', 'ELITE', '{"style":"aggressive","aggression":0.70}'::jsonb, true),
  ('story-ch5-duel-3', 'ELITE', '{"style":"combo","aggression":0.72}'::jsonb, true),
  ('story-ch5-duel-4', 'ELITE', '{"style":"control","aggression":0.76}'::jsonb, true),
  ('story-ch5-duel-5', 'BOSS', '{"style":"combo","aggression":0.84}'::jsonb, true)
on conflict (duel_id) do update set
  difficulty = excluded.difficulty, ai_profile = excluded.ai_profile, is_active = excluded.is_active, updated_at = now();

-- ── Escalado de mazo por duelo (nivel y tier de cada carta del rival) ────────
-- Del 72 al 80. Eco juega TU baraja, así que el escalado es lo único que lo hace peligroso.
delete from public.story_duel_deck_overrides where duel_id in ('story-ch5-duel-1', 'story-ch5-duel-2', 'story-ch5-duel-3', 'story-ch5-duel-4', 'story-ch5-duel-5');
insert into public.story_duel_deck_overrides
  (duel_id, slot_index, card_id, copies, version_tier, level, xp, attack_override, defense_override, effect_override, is_active)
values
  ('story-ch5-duel-1', 0, 'entity-python', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 1, 'entity-react', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 2, 'entity-typescript', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 3, 'entity-supabase', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 4, 'entity-postgress', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 5, 'exec-draw-1', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 6, 'exec-boost-atk-400', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 7, 'trap-mirror-buff-injection', 2, 2, 72, 0, null, null, null, true),
  ('story-ch5-duel-1', 8, 'trap-atk-drain', 1, 2, 72, 0, null, null, null, true),

  ('story-ch5-duel-2', 0, 'entity-python', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 1, 'entity-react', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 2, 'entity-typescript', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 3, 'entity-supabase', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 4, 'entity-postgress', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 5, 'exec-draw-1', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 6, 'exec-boost-atk-400', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 7, 'trap-mirror-buff-injection', 2, 2, 74, 0, null, null, null, true),
  ('story-ch5-duel-2', 8, 'trap-atk-drain', 1, 2, 74, 0, null, null, null, true),

  ('story-ch5-duel-3', 0, 'entity-python', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 1, 'entity-react', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 2, 'entity-typescript', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 3, 'entity-supabase', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 4, 'entity-postgress', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 5, 'exec-draw-1', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 6, 'exec-boost-atk-400', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 7, 'trap-mirror-buff-injection', 2, 3, 76, 0, null, null, null, true),
  ('story-ch5-duel-3', 8, 'trap-atk-drain', 1, 3, 76, 0, null, null, null, true),

  ('story-ch5-duel-4', 0, 'entity-tor', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 1, 'entity-kali-linux', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 2, 'entity-github', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 3, 'entity-git', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 4, 'exec-steal-opponent-execution', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 5, 'exec-octocat-steal-entity', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 6, 'exec-steal-opponent-graveyard-card', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 7, 'exec-terminal-hand-swap', 1, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 8, 'trap-nullify-opponent-trap', 2, 3, 78, 0, null, null, null, true),
  ('story-ch5-duel-4', 9, 'trap-counter-intrusion', 1, 3, 78, 0, null, null, null, true),

  ('story-ch5-duel-5', 0, 'entity-chatgpt', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 1, 'entity-claude', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 2, 'entity-rust', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 3, 'entity-kubernetes', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 4, 'entity-nextjs', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 5, 'exec-fusion-kaclauli', 1, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 6, 'exec-fusion-rustyfox', 1, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 7, 'exec-steal-opponent-execution', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 8, 'exec-direct-damage-900', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 9, 'trap-mirror-buff-injection', 2, 3, 80, 0, null, null, null, true),
  ('story-ch5-duel-5', 10, 'trap-kernel-panic', 1, 3, 80, 0, null, null, null, true);

-- ── Recompensas de carta garantizadas ────────────────────────────────────────
insert into public.story_duel_reward_cards (duel_id, card_id, copies, drop_rate, is_guaranteed)
values
  ('story-ch5-duel-3', 'fusion-rustyfox', 1, 1.0000, true),
  ('story-ch5-duel-5', 'fusion-kaclauli', 1, 1.0000, true)
on conflict (duel_id, card_id) do update set
  copies = excluded.copies, drop_rate = excluded.drop_rate, is_guaranteed = excluded.is_guaranteed, updated_at = now();
