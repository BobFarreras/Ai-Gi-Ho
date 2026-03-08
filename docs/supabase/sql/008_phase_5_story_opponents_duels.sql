-- docs/supabase/sql/008_phase_5_story_opponents_duels.sql - Crea estructura Story (oponentes, duelos, mazos y recompensas) con RLS y seed base.
create table if not exists public.story_opponents (
  id text primary key,
  display_name text not null,
  description text not null default '',
  avatar_url text null,
  difficulty text not null check (difficulty in ('ROOKIE', 'STANDARD', 'ELITE', 'BOSS', 'MYTHIC')),
  ai_profile jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.story_deck_lists (
  id text primary key,
  opponent_id text not null references public.story_opponents(id) on delete cascade,
  name text not null,
  description text not null default '',
  version integer not null default 1 check (version > 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.story_deck_list_cards (
  deck_list_id text not null references public.story_deck_lists(id) on delete cascade,
  slot_index integer not null check (slot_index >= 0 and slot_index < 60),
  card_id text not null references public.cards_catalog(id) on delete restrict,
  copies integer not null default 1 check (copies > 0 and copies <= 3),
  updated_at timestamptz not null default now(),
  primary key (deck_list_id, slot_index)
);

create table if not exists public.story_duels (
  id text primary key,
  chapter integer not null check (chapter > 0),
  duel_index integer not null check (duel_index > 0),
  title text not null,
  description text not null default '',
  opponent_id text not null references public.story_opponents(id) on delete restrict,
  deck_list_id text not null references public.story_deck_lists(id) on delete restrict,
  opening_hand_size integer not null default 4 check (opening_hand_size > 0 and opening_hand_size <= 7),
  starter_player text not null default 'PLAYER' check (starter_player in ('PLAYER', 'OPPONENT', 'RANDOM')),
  reward_nexus integer not null default 0 check (reward_nexus >= 0),
  reward_player_experience integer not null default 0 check (reward_player_experience >= 0),
  unlock_requirement_duel_id text null references public.story_duels(id) on delete set null,
  is_boss_duel boolean not null default false,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (chapter, duel_index)
);

create table if not exists public.story_duel_reward_cards (
  duel_id text not null references public.story_duels(id) on delete cascade,
  card_id text not null references public.cards_catalog(id) on delete restrict,
  copies integer not null default 1 check (copies > 0 and copies <= 5),
  drop_rate numeric(5,4) not null default 1.0000 check (drop_rate >= 0 and drop_rate <= 1),
  is_guaranteed boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (duel_id, card_id),
  check ((is_guaranteed = true and drop_rate = 1.0000) or is_guaranteed = false)
);

create table if not exists public.player_story_duel_progress (
  player_id uuid not null references auth.users(id) on delete cascade,
  duel_id text not null references public.story_duels(id) on delete cascade,
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  best_result text not null default 'NOT_PLAYED' check (best_result in ('NOT_PLAYED', 'LOST', 'WON')),
  first_cleared_at timestamptz null,
  last_played_at timestamptz null,
  updated_at timestamptz not null default now(),
  primary key (player_id, duel_id)
);

create index if not exists idx_story_opponents_active on public.story_opponents (is_active);
create index if not exists idx_story_duels_chapter on public.story_duels (chapter, duel_index);
create index if not exists idx_story_duels_opponent on public.story_duels (opponent_id);
create index if not exists idx_story_deck_lists_opponent on public.story_deck_lists (opponent_id);
create index if not exists idx_story_deck_list_cards_card on public.story_deck_list_cards (card_id);
create index if not exists idx_story_duel_reward_cards_duel on public.story_duel_reward_cards (duel_id);
create index if not exists idx_player_story_duel_progress_player on public.player_story_duel_progress (player_id);

drop trigger if exists story_opponents_set_updated_at on public.story_opponents;
create trigger story_opponents_set_updated_at
before update on public.story_opponents
for each row execute function public.set_updated_at();

drop trigger if exists story_deck_lists_set_updated_at on public.story_deck_lists;
create trigger story_deck_lists_set_updated_at
before update on public.story_deck_lists
for each row execute function public.set_updated_at();

drop trigger if exists story_deck_list_cards_set_updated_at on public.story_deck_list_cards;
create trigger story_deck_list_cards_set_updated_at
before update on public.story_deck_list_cards
for each row execute function public.set_updated_at();

drop trigger if exists story_duels_set_updated_at on public.story_duels;
create trigger story_duels_set_updated_at
before update on public.story_duels
for each row execute function public.set_updated_at();

drop trigger if exists story_duel_reward_cards_set_updated_at on public.story_duel_reward_cards;
create trigger story_duel_reward_cards_set_updated_at
before update on public.story_duel_reward_cards
for each row execute function public.set_updated_at();

drop trigger if exists player_story_duel_progress_set_updated_at on public.player_story_duel_progress;
create trigger player_story_duel_progress_set_updated_at
before update on public.player_story_duel_progress
for each row execute function public.set_updated_at();

alter table public.story_opponents enable row level security;
alter table public.story_deck_lists enable row level security;
alter table public.story_deck_list_cards enable row level security;
alter table public.story_duels enable row level security;
alter table public.story_duel_reward_cards enable row level security;
alter table public.player_story_duel_progress enable row level security;

drop policy if exists "story_opponents_select_public" on public.story_opponents;
create policy "story_opponents_select_public"
on public.story_opponents
for select
to authenticated
using (is_active = true);

drop policy if exists "story_deck_lists_select_public" on public.story_deck_lists;
create policy "story_deck_lists_select_public"
on public.story_deck_lists
for select
to authenticated
using (is_active = true);

drop policy if exists "story_deck_list_cards_select_public" on public.story_deck_list_cards;
create policy "story_deck_list_cards_select_public"
on public.story_deck_list_cards
for select
to authenticated
using (true);

drop policy if exists "story_duels_select_public" on public.story_duels;
create policy "story_duels_select_public"
on public.story_duels
for select
to authenticated
using (is_active = true);

drop policy if exists "story_duel_reward_cards_select_public" on public.story_duel_reward_cards;
create policy "story_duel_reward_cards_select_public"
on public.story_duel_reward_cards
for select
to authenticated
using (true);

drop policy if exists "player_story_duel_progress_select_own" on public.player_story_duel_progress;
create policy "player_story_duel_progress_select_own"
on public.player_story_duel_progress
for select
to authenticated
using (auth.uid() = player_id);

drop policy if exists "player_story_duel_progress_insert_own" on public.player_story_duel_progress;
create policy "player_story_duel_progress_insert_own"
on public.player_story_duel_progress
for insert
to authenticated
with check (auth.uid() = player_id);

drop policy if exists "player_story_duel_progress_update_own" on public.player_story_duel_progress;
create policy "player_story_duel_progress_update_own"
on public.player_story_duel_progress
for update
to authenticated
using (auth.uid() = player_id)
with check (auth.uid() = player_id);

insert into public.story_opponents (id, display_name, description, avatar_url, difficulty, ai_profile, is_active)
values
  ('opp-ch1-apprentice', 'Apprentice Null', 'Duelista de iniciación del capítulo 1.', null, 'ROOKIE', '{"style":"balanced","aggression":0.35}'::jsonb, true),
  ('opp-ch1-sysadmin', 'Sysadmin Rook', 'Controla trampas y defensa para alargar el duelo.', null, 'STANDARD', '{"style":"control","aggression":0.45}'::jsonb, true),
  ('opp-ch1-architect', 'Architect Sigma', 'Jefe del capítulo con sinergias de fusión.', null, 'BOSS', '{"style":"combo","aggression":0.6}'::jsonb, true),
  ('opp-ch2-warden', 'Firewall Warden', 'Especialista en desgaste y castigo de ejecuciones.', null, 'ELITE', '{"style":"punish","aggression":0.55}'::jsonb, true),
  ('opp-ch2-omega', 'Omega Core', 'Entidad de alto riesgo con presión constante.', null, 'MYTHIC', '{"style":"aggressive","aggression":0.78}'::jsonb, true)
on conflict (id) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  avatar_url = excluded.avatar_url,
  difficulty = excluded.difficulty,
  ai_profile = excluded.ai_profile,
  is_active = excluded.is_active;

insert into public.story_deck_lists (id, opponent_id, name, description, version, is_active)
values
  ('deck-opp-ch1-apprentice-v1', 'opp-ch1-apprentice', 'Apprentice v1', 'Mazo de aprendizaje.', 1, true),
  ('deck-opp-ch1-sysadmin-v1', 'opp-ch1-sysadmin', 'Sysadmin v1', 'Mazo de control básico.', 1, true),
  ('deck-opp-ch1-architect-v1', 'opp-ch1-architect', 'Architect v1', 'Mazo jefe de capítulo 1.', 1, true),
  ('deck-opp-ch2-warden-v1', 'opp-ch2-warden', 'Warden v1', 'Mazo de castigo de ejecuciones.', 1, true),
  ('deck-opp-ch2-omega-v1', 'opp-ch2-omega', 'Omega v1', 'Mazo de presión máxima.', 1, true)
on conflict (id) do update set
  opponent_id = excluded.opponent_id,
  name = excluded.name,
  description = excluded.description,
  version = excluded.version,
  is_active = excluded.is_active;

delete from public.story_deck_list_cards
where deck_list_id in (
  'deck-opp-ch1-apprentice-v1',
  'deck-opp-ch1-sysadmin-v1',
  'deck-opp-ch1-architect-v1',
  'deck-opp-ch2-warden-v1',
  'deck-opp-ch2-omega-v1'
);

insert into public.story_deck_list_cards (deck_list_id, slot_index, card_id, copies)
values
  ('deck-opp-ch1-apprentice-v1', 0, 'entity-python', 2),
  ('deck-opp-ch1-apprentice-v1', 1, 'entity-react', 2),
  ('deck-opp-ch1-apprentice-v1', 2, 'entity-supabase', 2),
  ('deck-opp-ch1-apprentice-v1', 3, 'entity-postgress', 2),
  ('deck-opp-ch1-apprentice-v1', 4, 'exec-draw-1', 3),
  ('deck-opp-ch1-apprentice-v1', 5, 'exec-boost-atk-400', 3),
  ('deck-opp-ch1-apprentice-v1', 6, 'trap-atk-drain', 3),
  ('deck-opp-ch1-apprentice-v1', 7, 'trap-def-fragment', 3),
  ('deck-opp-ch1-sysadmin-v1', 0, 'entity-kali-linux', 2),
  ('deck-opp-ch1-sysadmin-v1', 1, 'entity-github', 2),
  ('deck-opp-ch1-sysadmin-v1', 2, 'entity-openclaw', 2),
  ('deck-opp-ch1-sysadmin-v1', 3, 'entity-chatgpt', 2),
  ('deck-opp-ch1-sysadmin-v1', 4, 'exec-llm-def-300', 3),
  ('deck-opp-ch1-sysadmin-v1', 5, 'exec-draw-1', 3),
  ('deck-opp-ch1-sysadmin-v1', 6, 'trap-runtime-punish', 3),
  ('deck-opp-ch1-sysadmin-v1', 7, 'trap-counter-intrusion', 3),
  ('deck-opp-ch1-architect-v1', 0, 'entity-chatgpt', 2),
  ('deck-opp-ch1-architect-v1', 1, 'entity-gemini', 2),
  ('deck-opp-ch1-architect-v1', 2, 'entity-claude', 2),
  ('deck-opp-ch1-architect-v1', 3, 'entity-kali-linux', 2),
  ('deck-opp-ch1-architect-v1', 4, 'exec-fusion-gemgpt', 2),
  ('deck-opp-ch1-architect-v1', 5, 'exec-fusion-kaclauli', 2),
  ('deck-opp-ch1-architect-v1', 6, 'exec-draw-1', 2),
  ('deck-opp-ch1-architect-v1', 7, 'trap-kernel-panic', 2),
  ('deck-opp-ch1-architect-v1', 8, 'trap-runtime-punish', 2),
  ('deck-opp-ch1-architect-v1', 9, 'exec-boost-atk-400', 2),
  ('deck-opp-ch2-warden-v1', 0, 'entity-ollama', 2),
  ('deck-opp-ch2-warden-v1', 1, 'entity-deepseek', 2),
  ('deck-opp-ch2-warden-v1', 2, 'entity-astro', 2),
  ('deck-opp-ch2-warden-v1', 3, 'entity-vercel', 2),
  ('deck-opp-ch2-warden-v1', 4, 'exec-direct-damage-600', 3),
  ('deck-opp-ch2-warden-v1', 5, 'exec-heal-700', 2),
  ('deck-opp-ch2-warden-v1', 6, 'trap-runtime-punish', 3),
  ('deck-opp-ch2-warden-v1', 7, 'trap-counter-intrusion', 2),
  ('deck-opp-ch2-omega-v1', 0, 'entity-gemini', 2),
  ('deck-opp-ch2-omega-v1', 1, 'entity-chatgpt', 2),
  ('deck-opp-ch2-omega-v1', 2, 'entity-claude', 2),
  ('deck-opp-ch2-omega-v1', 3, 'entity-git', 2),
  ('deck-opp-ch2-omega-v1', 4, 'exec-fusion-gemgpt', 2),
  ('deck-opp-ch2-omega-v1', 5, 'exec-draw-1', 2),
  ('deck-opp-ch2-omega-v1', 6, 'exec-boost-atk-400', 2),
  ('deck-opp-ch2-omega-v1', 7, 'trap-kernel-panic', 2),
  ('deck-opp-ch2-omega-v1', 8, 'trap-atk-drain', 2),
  ('deck-opp-ch2-omega-v1', 9, 'exec-heal-700', 2);

insert into public.story_duels (
  id,
  chapter,
  duel_index,
  title,
  description,
  opponent_id,
  deck_list_id,
  opening_hand_size,
  starter_player,
  reward_nexus,
  reward_player_experience,
  unlock_requirement_duel_id,
  is_boss_duel,
  is_active
)
values
  ('story-ch1-duel-1', 1, 1, 'Primera Sincronización', 'Duelo introductorio para calibrar tu mazo.', 'opp-ch1-apprentice', 'deck-opp-ch1-apprentice-v1', 4, 'PLAYER', 120, 60, null, false, true),
  ('story-ch1-duel-2', 1, 2, 'Control de Tráfico', 'Un sysadmin intentará bloquear tu ritmo.', 'opp-ch1-sysadmin', 'deck-opp-ch1-sysadmin-v1', 4, 'RANDOM', 180, 90, 'story-ch1-duel-1', false, true),
  ('story-ch1-duel-3', 1, 3, 'Núcleo de Arquitectura', 'Jefe del capítulo 1 con línea de fusión.', 'opp-ch1-architect', 'deck-opp-ch1-architect-v1', 4, 'OPPONENT', 350, 180, 'story-ch1-duel-2', true, true),
  ('story-ch2-duel-1', 2, 1, 'Cortafuegos Profundo', 'Combate de desgaste con castigo de efectos.', 'opp-ch2-warden', 'deck-opp-ch2-warden-v1', 4, 'RANDOM', 420, 220, 'story-ch1-duel-3', false, true),
  ('story-ch2-duel-2', 2, 2, 'Omega Core', 'Encuentro de alta dificultad orientado a presión constante.', 'opp-ch2-omega', 'deck-opp-ch2-omega-v1', 4, 'OPPONENT', 700, 360, 'story-ch2-duel-1', true, true)
on conflict (id) do update set
  chapter = excluded.chapter,
  duel_index = excluded.duel_index,
  title = excluded.title,
  description = excluded.description,
  opponent_id = excluded.opponent_id,
  deck_list_id = excluded.deck_list_id,
  opening_hand_size = excluded.opening_hand_size,
  starter_player = excluded.starter_player,
  reward_nexus = excluded.reward_nexus,
  reward_player_experience = excluded.reward_player_experience,
  unlock_requirement_duel_id = excluded.unlock_requirement_duel_id,
  is_boss_duel = excluded.is_boss_duel,
  is_active = excluded.is_active;

insert into public.story_duel_reward_cards (duel_id, card_id, copies, drop_rate, is_guaranteed)
values
  ('story-ch1-duel-1', 'entity-python', 1, 1.0000, true),
  ('story-ch1-duel-2', 'trap-def-fragment', 1, 1.0000, true),
  ('story-ch1-duel-3', 'exec-fusion-gemgpt', 1, 1.0000, true),
  ('story-ch2-duel-1', 'trap-runtime-punish', 1, 1.0000, true),
  ('story-ch2-duel-2', 'exec-direct-damage-600', 1, 1.0000, true),
  ('story-ch2-duel-2', 'entity-gemini', 1, 0.2500, false)
on conflict (duel_id, card_id) do update set
  copies = excluded.copies,
  drop_rate = excluded.drop_rate,
  is_guaranteed = excluded.is_guaranteed;
