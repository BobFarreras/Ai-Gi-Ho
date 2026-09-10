<!-- docs/supabase/despliegue-modos-pve.md - Runbook del despliegue de Supervivencia y Olimpo (migraciones 149-160 + los cuatro fixes de survival). -->
# Despliegue de los modos PvE (migraciones 149 → 160 + los cuatro fixes de survival)

Producción va por la **148**. Esta entrega añade **dieciséis** migraciones. Todas son aditivas: crean
tablas y funciones nuevas, o amplían objetos existentes sin quitar nada.

> **Aviso (2026-09-10).** Este runbook nació listando solo las doce primeras (149→160) y así se
> aplicó el 2026-08-03: **las cuatro últimas se quedaron fuera durante cinco semanas** y Supervivencia
> arrastró en producción una llamada a una RPC inexistente. Ya están aplicadas. Antes de dar por
> cerrada cualquier entrega, haz la comprobación de [¿Cuáles faltan de verdad?](#cuáles-faltan-de-verdad)
> en vez de fiarte de esta tabla.

## Orden (obligatorio)

Se pegan una a una en el SQL Editor de Supabase producción, **en este orden**.

| # | Fichero | Qué hace |
| --- | --- | --- |
| 149 | `20260101000230_149_buy_item_commercial_ranking.sql` | puntúa la compra de objetos en el ranking comercial |
| 150 | `20260101000231_150_arena_modes_foundation.sql` | tablas, RLS y RPC base de Supervivencia y Olimpo |
| 151 | `20260101000232_151_survival_idempotent_start_issue.sql` | arrancar expedición y emitir combate se vuelven idempotentes |
| 152 | `20260101000233_152_forfeit_abandoned_survival_battles.sql` | cierra como derrota los combates abandonados |
| 153 | `20260101000234_153_combat_session_journal_checkpoint.sql` | `combat_sessions.journal_json` + checkpoint por turno |
| 154 | `20260101000235_154_olympus_runtime_foundation.sql` | ajustes de Olimpo, leyendas Zeus/Loki/Hefes y respec de pago |
| 155 | `20260101000236_155_pve_modes_admin_publishing.sql` | RPC de publicación versionada para el panel admin |
| 156 | `20260101000237_156_olympus_deck_level_100.sql` | sube a 100 el tope de nivel del deck legendario |
| 157 | `20260101000238_157_olympus_backfill_champion_unlocks.sql` | recupera los campeones ya ganados en Arena |
| 158 | `20260101000239_158_olympus_tree_redesign.sql` | rediseño del árbol (Identidad sube versión, no nivel) |
| 159 | `20260101000240_159_olympus_upgrade_ranks.sql` | las mejoras pasan a subir por rangos acumulables |
| 160 | `20260101000241_160_olympus_nexus_and_card_rewards.sql` | Nexus y carta de botín por leyenda |
| 13 | `20260730094509_invalidate_stale_survival_battles.sql` | RPC `invalidate_survival_battle`: caduca un combate emitido y devuelve la expedición al índice anterior |
| 14 | `20260730094827_allow_reissued_survival_battle_index.sql` | cambia el `unique (run_id, battle_index)` por un índice parcial que excluye `EXPIRED`, para poder reemitir |
| 15 | `20260730102313_survival_progress_read_model.sql` | índice `(player_id, wins desc)` para el récord de la expedición |
| 16 | `20260730103704_survival_ascension_card_scaling.sql` | siembra `statBonusPerRank` en los tramos del ruleset v1 (HARD 75 / BOSS 125 / MYTHIC 175) |

Las doce primeras abren su propia transacción (`begin; … commit;`), así que una que falle no deja
nada a medias. Las **cuatro últimas no la abren**: a la 13 y la 14 conviene ponerles el
`begin; … commit;` a mano al pegarlas (la 14 tira el constraint y crea el índice, y no interesa
quedarse entre medias, sin unicidad); la 15 y la 16 son una sentencia suelta cada una.

## ¿Cuáles faltan de verdad?

La fuente de verdad es la carpeta `supabase/migrations/`, no esta tabla. Antes de empezar y otra vez
al terminar, compara la carpeta con el historial de producción:

```bash
ls supabase/migrations
```

y, contra producción (MCP de Supabase `list_migrations`, o en el SQL Editor):

```sql
select version, name from supabase_migrations.schema_migrations order by version;
```

Ojo con el orden: producción registra cada migración con **el timestamp del día en que se aplicó**,
no con el del nombre del fichero, así que los dos listados no se pueden comparar por posición — hay
que comparar por **nombre**. Y en local conviven dos convenciones de timestamp (los `202601010002xx`
sintéticos de la serie 149-160 y los reales tipo `20260730…`), que es justo lo que hizo que estas
cuatro ordenaran después de la 160 y se cayeran de la lista.

Comprobación rápida de que las cuatro últimas están puestas:

```sql
select
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'invalidate_survival_battle') as fn_invalidate,
  (select count(*) from pg_indexes
     where schemaname = 'public' and indexname = 'survival_battles_one_effective_attempt_idx') as idx_reemision,
  (select count(*) from pg_constraint
     where conname = 'survival_battles_run_id_battle_index_key') as constraint_viejo,
  (select count(*) from pg_indexes
     where schemaname = 'public' and indexname = 'idx_player_survival_runs_best_wins') as idx_record,
  (select count(*) from public.survival_scaling_stages
     where ascension_modifiers_json ? 'statBonusPerRank') as tramos_con_bonus;
```

Esperado: `1 | 1 | 0 | 1 | 3`.

## Antes o después del deploy

**Antes.** Son tablas y funciones nuevas: aplicarlas con el código viejo desplegado no rompe nada
—nadie las llama todavía— mientras que desplegar el código primero deja Supervivencia y Olimpo
apuntando a tablas que no existen.

> Ojo: esto es lo contrario de la regla de [db-sync-guide.md](./db-sync-guide.md) para **cerrar**
> tablas de valor a `service_role`, que siempre va **después** del deploy. Aquí no se cierra nada
> que el código actual esté escribiendo.

Las dos que tocan objetos ya existentes son compatibles hacia atrás:

1. La **149** reemplaza `buy_level_candy` conservando su firma; el crédito de ranking va dentro de
   la misma ruta idempotente que ya cobraba.
2. La **153** añade `journal_json` a `combat_sessions` con default, sin tocar las columnas que lee
   el código actual.

La **160** recrea `complete_olympus_battle` con dos argumentos más (Nexus y carta). Deja de existir
la firma de cinco argumentos, pero solo la llama código de esta misma entrega.

La **14** es la única que quita algo: el constraint `survival_battles_run_id_battle_index_key`. Lo
sustituye en el acto por un índice único parcial que sigue impidiendo dos intentos vivos del mismo
combate y solo deja de aplicar a las filas `EXPIRED`, que es justo lo que permite reemitir. El
código viejo nunca crea filas `EXPIRED`, así que aplicarla antes del deploy no cambia nada.

## Después de aplicarlas

1. Comprobar que el catálogo quedó sembrado:
   ```sql
   select (select count(*) from survival_rulesets where is_active) as rulesets,
          (select count(*) from olympus_settings where is_active) as ajustes,
          (select count(*) from olympus_champions where is_active) as campeones,
          (select count(*) from olympus_opponents where is_active) as leyendas,
          (select count(*) from olympus_champion_upgrade_nodes where is_active) as nodos;
   ```
   Esperado: `1 | 1 | 8 | 3 | 32`.
2. Pasar la comprobación de [¿Cuáles faltan de verdad?](#cuáles-faltan-de-verdad): el diff de nombres
   contra producción debe salir vacío.
3. Desplegar el código (push a `main`).
4. Entrar en `/hub/academy/training/arena` y verificar que el portal abre los tres modos.
5. Repasar en el panel de admin (`Modos PvE`) que las tres leyendas tienen su Nexus y su carta.

## Historial de aplicación en producción

| Fecha | Qué se aplicó | Versiones registradas |
| --- | --- | --- |
| 2026-08-03 | 149 → 160 | `20260803055009` → `20260803055622` |
| 2026-09-10 | los cuatro fixes de survival, que se saltó la tabla original | `20260910115148` → `20260910115207` |
