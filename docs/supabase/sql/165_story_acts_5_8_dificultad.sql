-- docs/supabase/sql/165_story_acts_5_8_dificultad.sql - Sube la dificultad real de los Actos 5-8: niveles, tier de
-- versión y ATRIBUTOS BASE de las entidades rivales. Correctivo de las migraciones 161-164, que dejaron los mazos
-- con los stats pelados del catálogo.
--
-- EL PROBLEMA QUE ARREGLA: los rivales de los Actos 1-4 llevan `attack_override`/`defense_override` (bases de
-- 2000-2600), y los de los Actos 5-8 no llevaban ninguno (bases de catálogo, 1263-1920 de media). Como la curva
-- de nivel sólo da +150 ATK entre el nivel 72 y el 100 (`card-level-bonus-rules.ts`: +750/+750 acumulados al
-- llegar a 100, y a nivel 72 ya se llevan +600/+450), el primer rival del Acto 5 pegaba MENOS que el primero del
-- Acto 4. La campaña se ablandaba justo en el tramo final.
--
-- CÓMO SE SUBE: los overrides fijan la BASE de la carta y encima se aplica la curva de nivel
-- (`apply-story-deck-entry-to-card.ts`), así que el ATK efectivo es base + bonus de nivel. Se suma un DELTA por
-- duelo sobre el stat de catálogo en vez de poner un número plano: así la identidad de cada carta se conserva
-- (el Annihilator sigue siendo el más fuerte de su mazo) y sólo sube el listón del duelo entero.
--
-- SOLO ENTIDADES: magias y trampas no tienen ATK/DEF. De ellas sube el nivel, que es lo que les rebaja energía.
--
-- TECHO DE DISEÑO: el jefe final queda en ~4230 de ATK efectivo. La mejor fusión del jugador (KaClauli/GemGPT,
-- 3800) con una mejora de +400 llega a 4200: se gana con la fusión y el remate preparados, no a pelo.

begin;

-- ── Nivel y tier de versión por duelo (todas las cartas del mazo) ────────────
-- Antes: 72→100 arrancando por debajo del cierre del Acto 4. Ahora arranca en 75 y sube acto a acto.
update public.story_duel_deck_overrides o
set level = v.level, version_tier = v.tier, updated_at = now()
from (values
  ('story-ch5-duel-1', 75, 3), ('story-ch5-duel-2', 78, 3), ('story-ch5-duel-3', 81, 3),
  ('story-ch5-duel-4', 84, 4), ('story-ch5-duel-5', 87, 4),
  ('story-ch6-duel-1', 88, 4), ('story-ch6-duel-2', 90, 4), ('story-ch6-duel-3', 92, 4),
  ('story-ch6-duel-4', 94, 4), ('story-ch6-duel-5', 96, 5),
  ('story-ch7-duel-1', 96, 5), ('story-ch7-duel-2', 97, 5), ('story-ch7-duel-3', 98, 5),
  ('story-ch7-duel-4', 99, 5), ('story-ch7-duel-5', 100, 5),
  ('story-ch8-duel-1', 100, 5), ('story-ch8-duel-2', 100, 5), ('story-ch8-duel-3', 100, 5),
  ('story-ch8-duel-4', 100, 5), ('story-ch8-duel-5', 100, 5), ('story-ch8-duel-6', 100, 5),
  ('story-ch8-duel-7', 100, 5)
) as v(duel_id, level, tier)
where o.duel_id = v.duel_id;

-- ── Atributos base de las entidades (delta sobre el catálogo) ────────────────
update public.story_duel_deck_overrides o
set attack_override = c.attack + v.atk_delta,
    defense_override = c.defense + v.def_delta,
    updated_at = now()
from public.cards_catalog c, (values
  -- Acto 5: se recoge el testigo del cierre del Acto 4 (~2600 efectivos) y se sube hasta el Reflejo.
  ('story-ch5-duel-1', 650, 300), ('story-ch5-duel-2', 750, 350), ('story-ch5-duel-3', 800, 400),
  ('story-ch5-duel-4', 900, 450), ('story-ch5-duel-5', 800, 500),
  -- Acto 6: Nimbus es un muro (más DEF que ATK), el Enjambre pega y el Leviatán hace las dos cosas.
  ('story-ch6-duel-1', 950, 600), ('story-ch6-duel-2', 1000, 650), ('story-ch6-duel-3', 1050, 500),
  ('story-ch6-duel-4', 1100, 550), ('story-ch6-duel-5', 1050, 700),
  -- Acto 7: la Fundición sube en línea recta hasta el Prototipo.
  ('story-ch7-duel-1', 1100, 550), ('story-ch7-duel-2', 1150, 600), ('story-ch7-duel-3', 1200, 600),
  ('story-ch7-duel-4', 1250, 650), ('story-ch7-duel-5', 1300, 700),
  -- Acto 8: el Coro va parejo entre sí (son simultáneos) y La Entidad sube fase a fase.
  ('story-ch8-duel-1', 1250, 700), ('story-ch8-duel-2', 1300, 1100), ('story-ch8-duel-3', 1350, 800),
  ('story-ch8-duel-4', 1450, 800), ('story-ch8-duel-5', 1450, 900), ('story-ch8-duel-6', 1550, 1000),
  ('story-ch8-duel-7', 1700, 1100)
) as v(duel_id, atk_delta, def_delta)
where o.duel_id = v.duel_id
  and c.id = o.card_id
  and c.type = 'ENTITY';

commit;
