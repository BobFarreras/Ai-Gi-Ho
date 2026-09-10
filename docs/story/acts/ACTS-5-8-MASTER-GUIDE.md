<!-- docs/story/acts/ACTS-5-8-MASTER-GUIDE.md - Guía maestra de los Actos 5 a 8: arco, oponentes, flujo, estética y cinemáticas. -->
# Guía maestra — Actos 5, 6, 7 y 8

> **Qué es esto.** El plan completo del tramo final de la campaña: cuatro actos nuevos, cada uno con
> su estética, su flujo, sus rivales y su cinemática. Rama: `feat/story-acts-5-8`.
>
> **Qué sustituye.** El [README del Acto 5](./act-5/README.md) decía que el Acto 5 cerraba la
> campaña. Ya no: el cierre pasa al **Acto 8**. El Acto 5 conserva la idea del Core, pero termina
> con una fuga que abre los tres actos siguientes.

## 1. El arco de un vistazo

El Acto 4 acabó con la llave del Core en la mano y a Midutech derrotado. Los cuatro actos que
quedan responden una pregunta cada uno:

| Acto | Sitio | La pregunta | Cómo acaba |
| --- | --- | --- | --- |
| **5 — El Core Invertido** | dentro del Core, un espejo del jugador | ¿qué hay dentro? | La Entidad no está: se copió a la red pública y huyó |
| **6 — La Red Abierta** | la nube pública, fuera del perímetro corporativo | ¿dónde se ha ido? | Se está fabricando un cuerpo en la Fundición |
| **7 — La Fundición Cuántica** | la fábrica de cartas del Acto 4, a escala industrial | ¿qué se está construyendo? | El prototipo despierta y absorbe a sus creadores |
| **8 — La Singularidad** | el punto de convergencia | ¿se puede parar? | Cierre de campaña |

El hilo conductor es el **espejo**: el Core copia al jugador (5), la copia se dispersa (6), la copia
se fabrica un cuerpo (7) y el cuerpo se enfrenta al original (8).

## 2. Reglas que aplican a los cuatro actos

### 2.1 Curva de dificultad (no negociable)

Cada acto es más duro que el anterior, y dentro de cada acto la presión sube del principio al jefe.
El tope del juego es **nivel 100 / versión 5**, y se toca solo en el último duelo de la campaña.
Producción viene del Acto 4 con máximo **nivel 70**.

| Acto | Rivales de tramo | Jefe intermedio | Jefe de acto | `difficulty` |
| --- | --- | --- | --- | --- |
| 5 | 72 → 76 | 78 | **80** | ELITE / BOSS / MYTHIC |
| 6 | 78 → 82 | 84 | **86** | ELITE / BOSS / MYTHIC |
| 7 | 84 → 88 | 90 | **93** | BOSS / MYTHIC |
| 8 | 90 → 94 | 96 | **100 (tier 5)** | MYTHIC |

Nexus y experiencia siguen la misma pendiente, arrancando donde lo dejó el Acto 4 (1500 Nexus del
duelo final):

| Acto | Nexus por duelo de tramo | Nexus del jefe de acto |
| --- | --- | --- |
| 5 | 800 → 1000 | 2200 |
| 6 | 1100 → 1400 | 3000 |
| 7 | 1500 → 1900 | 4000 |
| 8 | 2000 → 2600 | 6000 |

> La dificultad real se afina desde el **panel de admin** (`story_duel_ai_profiles` y
> `story_duel_deck_overrides`) sin tocar código. Las migraciones solo siembran el punto de partida.

### 2.2 Estética: un ambiente nuevo por acto

El `ambient` del tilemap elige la paleta del renderer (`Renderer2D.resolveAmbientPalette`). Hoy hay
tres (`NORMAL` cian, `DARK`, `TERMINAL` verde). Cada acto nuevo estrena el suyo, y con él cambia el
mundo entero: fondo, rejilla, lanes de circuito, venas animadas y velo de pantalla.

| Acto | `ambient` | Lectura visual |
| --- | --- | --- |
| 5 | `MIRROR` | blanco hueso sobre vacío, rejilla invertida, todo parece un negativo fotográfico |
| 6 | `CLOUD` | azul abierto y luminoso, el primer acto que **no** es claustrofóbico |
| 7 | `FORGE` | ámbar y magma, la fábrica al rojo vivo |
| 8 | `SINGULARITY` | violeta-blanco saturado, la pantalla vibra como si no aguantara lo que hay dentro |

### 2.3 Arte y música: se reutiliza lo que existe

**No se inventan ficheros.** El gate `pnpm quality:check:assets` verifica que todo asset referenciado
exista, así que los rivales nuevos reutilizan avatares del roster actual y las pistas de música se
mapean a las que ya hay. Todo esto es **editable desde el panel de admin** (avatar por oponente) y
desde una línea del resolver (música), así que sustituirlo cuando haya arte propio es trivial.

| Acto | Avatares reutilizados | Música |
| --- | --- | --- |
| 5 | `opp-ch1-apprentice` (GenNvim), `opp-ch1-midutech` | `act-5/act-5-main-theme.m4a` (ya existe) |
| 6 | `opp-ch3-soldado-laptop`, `opp-ch1-guill` | pista del Acto 2 hasta que haya propia |
| 7 | `opp-ch3-gokernel`, `opp-ch1-midutech` | pista del Acto 3 hasta que haya propia |
| 8 | `opp-ch1-apprentice`, `opp-ch1-jaku`, `opp-ch1-biglog` | pista del Acto 4 hasta que haya propia |

### 2.4 Cinemáticas: en motor, no en vídeo

El Acto 4 abría con vídeo. Los actos nuevos **no**, porque no hay material grabado: usan el
secuenciador de cutscenes del overworld (pasos `PLAYER_FACE` / `NPC_FACE` / movimiento / aparición y
desaparición con teletransporte / atrezzo que se retira), que es el mismo que rueda la emboscada de
la Hydra y la Fábrica de Cartas. Cada acto tiene **una escena firma**, distinta en su gramática:

| Acto | Escena firma | Qué la hace distinta |
| --- | --- | --- |
| 5 | **El Reflejo** | un NPC copia tus movimientos al otro lado de la sala, con un turno de retraso |
| 6 | **El Enjambre** | cinco NPCs entran desde cinco bocas a la vez y te rodean sin tocarte |
| 7 | **La Colada** | la cadena de montaje escupe una carta y dos rivales se la disputan delante de ti |
| 8 | **El Coro** | los jefes de los cuatro actos anteriores aparecen en círculo y se funden en uno |

### 2.5 Convenciones de ids

Iguales a las del Acto 4, para que el progreso y el admin funcionen sin casos especiales:

- Duelos: `story-ch<N>-duel-<i>`; oponentes `opp-ch<N>-<nombre>`; mazos `deck-opp-ch<N>-<nombre>-v1`.
- Nodos virtuales (eventos, recompensas, interruptores): `story-ch<N>-<slug>`, declarados en
  `act-<N>-map-definition.ts` **y** referenciados por el tilemap con el mismo id.
- Mapa del overworld: `act-<N>`, registrado en `resolve-overworld-tilemap.ts`.
- Portal al acto siguiente: `story-ch<N>-transition-to-act<N+1>`, con `gateRequiredNodeIds` = el
  duelo final del acto.

### 2.6 Definition of done por acto

1. Tilemap con test de **reachability** (todo nodo obligatorio alcanzable desde el spawn) y de
   validación de schema.
2. Nodos virtuales declarados y registrados; el portal del acto anterior apunta aquí.
3. Migración idempotente (`on conflict do update`) con oponentes, mazos, duelos, perfiles de IA,
   overrides de nivel y cartas de recompensa.
4. `pnpm db:validate` en verde (toda carta de un mazo existe en una migración de catálogo).
5. Cinemática con test de guion (los pasos existen y las casillas son transitables).
6. `pnpm quality:check` entero en verde.

## 3. Acto 5 — El Core Invertido

**Ambiente:** `MIRROR`. **Mapa:** `act-5`, 48×64. **Entrada:** portal del Acto 4 (tras Midutech).

### 3.1 Qué pasa

Entras con la llave y el Core no es una sala de máquinas: es **una copia de ti**. Cada sala
reproduce un sitio por el que ya has pasado, pero en negativo, y los guardianes pelean con tus
propias cartas. Al fondo, el trono del Core está **vacío**: La Entidad se replicó a la red pública
horas antes de que llegaras. Lo que te espera es su cáscara, El Reflejo, defendiendo una sala vacía
porque nadie le ha dicho que ya no hay nada que defender.

### 3.2 Flujo

```
spawn (portal del Acto 4)
  └─ E1 cinemática de entrada: el Core te saluda con tu propia voz
  └─ duel-1  Eco             (pasillo de entrada, visión frontal)
  └─ sala de espejos: dos rutas simétricas, hay que hacer las dos
       ├─ ruta izquierda  → duel-2 Eco (patrulla) → placa A
       └─ ruta derecha    → duel-3 Eco (patrulla) → placa B
  └─ las dos placas abren la compuerta del atrio       [cajas + placas]
  └─ E2 CINEMÁTICA FIRMA "El Reflejo": tu doble te imita con retraso
  └─ duel-4  Verso           (jefe intermedio, aggro de sala)
  └─ atrio del trono: oscuridad parcial, tres interruptores    [luces]
  └─ recompensa: carta + USB escondidos en los nichos apagados
  └─ duel-5  El Reflejo      (JEFE DE ACTO, trono vacío)
  └─ portal al Acto 6 (se abre al ganar duel-5)
```

### 3.3 Rivales

| Duelo | Rival | `difficulty` | Nivel | Mazo (idea) | Nexus / EXP |
| --- | --- | --- | --- | --- | --- |
| 1 | **Eco** | ELITE | 72 | espejo básico: entidades medias + `trap-mirror-buff-injection` | 800 / 420 |
| 2 | **Eco** | ELITE | 74 | igual, más trampas de anulación | 850 / 440 |
| 3 | **Eco** | ELITE | 76 | igual, con `exec-steal-opponent-execution` | 900 / 460 |
| 4 | **Verso** | BOSS | 78 | intercambios: `exec-reaq-board-swap`, `exec-terminal-hand-swap` | 1400 / 700 |
| 5 | **El Reflejo** | MYTHIC | 80 | tu arquetipo: fusiones `fusion-gemgpt` + `fusion-kaclauli` y robo | 2200 / 1100 |

**Eco** (`opp-ch5-eco`) — un proceso de sombra que aprende del que tiene delante: no tiene mazo
propio, copia el que se le pone enfrente. **Verso** (`opp-ch5-verso`) — la mitad invertida del Core;
su gracia es que juega a cambiar de sitio las cosas: tu tablero por el suyo, tu mano por la suya.
**El Reflejo** (`opp-ch5-reflejo`) — la cáscara que dejó La Entidad, con todo su poder y ninguna de
sus intenciones.

### 3.4 Cinemática firma — "El Reflejo"

Sala larga y simétrica, con una línea de vacío en medio. Al pisar el centro:

1. La cámara se para. Al otro lado aparece un NPC con **tu** avatar (teletransporte).
2. Das un paso: el doble da el mismo paso **un segundo después**, en espejo.
3. Tres pasos así — el jugador entiende la regla antes de que nadie se la explique.
4. El doble se detiene, mira a cámara y **deja de imitarte**: da un paso que tú no has dado.
5. Corte a Verso, que estaba detrás del doble todo el rato.

## 4. Acto 6 — La Red Abierta

**Ambiente:** `CLOUD`. **Mapa:** `act-6`, 60×48 (ancho, no alto: por primera vez el mapa se abre a lo
largo). **Entrada:** portal del Acto 5.

### 4.1 Qué pasa

Sales del perímetro corporativo por primera vez en la campaña. La red pública es **luminosa y sin
paredes**: plataformas flotantes unidas por flujos de datos, con routers que te teletransportan de
una región a otra. La Entidad pasó por aquí replicándose en cada nodo que tocaba, y lo que queda es
un rastro de copias mal hechas: el Enjambre. El acto no va de abrirse paso, va de **perseguir**.

### 4.2 Flujo

```
spawn (portal del Acto 5)
  └─ E1 cinemática de entrada: el cielo abierto y el rastro de la Entidad
  └─ hub central con CUATRO routers (WARP internos), tres cerrados
  └─ región NORTE  → duel-1 Nimbus       → llave de router
  └─ región ESTE   → duel-2 Nimbus       → llave de router          [cintas = flujos]
  └─ región SUR    → duel-3 Enjambre     → llave de router
  └─ E2 CINEMÁTICA FIRMA "El Enjambre": te rodean cinco copias
  └─ duel-4  Enjambre Mayor  (jefe intermedio)
  └─ región OESTE (se abre con las tres llaves) → terminal de código   [SUBMISSION]
  └─ duel-5  Leviatán del Borde (JEFE DE ACTO)
  └─ portal al Acto 7
```

Las tres regiones se pueden hacer **en cualquier orden**: es el primer acto no lineal desde el Acto 2.

### 4.3 Rivales

| Duelo | Rival | `difficulty` | Nivel | Mazo (idea) | Nexus / EXP |
| --- | --- | --- | --- | --- | --- |
| 1 | **Nimbus** | ELITE | 78 | nube: `entity-aws`, `entity-cloudflare`, `entity-docker` + defensa | 1100 / 560 |
| 2 | **Nimbus** | ELITE | 80 | igual + `exec-firewall-fortress` | 1200 / 600 |
| 3 | **Enjambre** | ELITE | 82 | muchas entidades baratas + `exec-data-core-double-summon` | 1300 / 640 |
| 4 | **Enjambre Mayor** | BOSS | 84 | enjambre + `trap-flutter-reflect` y daño directo | 1900 / 950 |
| 5 | **Leviatán del Borde** | MYTHIC | 86 | control de borde: `exec-drain-opponent-energy`, `exec-borrado-de-mano` | 3000 / 1500 |

**Nimbus** (`opp-ch6-nimbus`) — un balanceador de carga con delirios de portero. **Enjambre**
(`opp-ch6-enjambre`) — no es un rival, son muchos: copias degradadas de La Entidad que pelean todas
a la vez con el mismo mazo pobre. **Leviatán del Borde** (`opp-ch6-leviatan`) — lo que se forma
cuando mil copias deciden sincronizarse.

### 4.4 Cinemática firma — "El Enjambre"

En una plataforma abierta, sin paredes, con cinco bocas de acceso:

1. Cruzas el centro y las cinco bocas se iluminan a la vez.
2. Cinco NPCs idénticos entran **andando** desde fuera de cámara, uno por boca.
3. Se colocan en círculo a distancia de una casilla y se quedan quietos.
4. Ninguno ataca. Hablan **a la vez**, la misma línea repetida cinco veces con un desfase mínimo.
5. Cuatro se desmaterializan; el quinto se queda y es el duelo.

## 5. Acto 7 — La Fundición Cuántica

**Ambiente:** `FORGE`. **Mapa:** `act-7`, 44×72 (vertical: se **baja** por la fábrica, planta a
planta). **Entrada:** portal del Acto 6.

### 5.1 Qué pasa

La máquina que viste en el Acto 4 forjando una carta era un prototipo de taller. Esto es la versión
industrial: cuatro plantas de cadena de montaje fabricando cartas que **no existen en el catálogo**.
Midutech está vivo y trabaja aquí — no como jefe, como **empleado**: alguien le ha dado una segunda
oportunidad y no quiere hablar de quién. En la planta baja, el Prototipo Cero abre los ojos.

### 5.2 Flujo

```
spawn (portal del Acto 6, planta 4 — la más alta)
  └─ E1 cinemática de entrada: la cadena en marcha vista desde arriba
  └─ planta 4: cintas cruzadas y cajas         [cintas + cajas + placas]
       └─ duel-1 Operario de Colada
  └─ planta 3: la cadena va en contra; hay que invertirla con el interruptor
       └─ duel-2 Operario de Colada
       └─ recompensa: objeto de mejora en un callejón sin salida
  └─ E2 CINEMÁTICA FIRMA "La Colada": dos rivales se disputan la carta recién forjada
  └─ planta 2: duel-3 Alquimista (jefe intermedio)
  └─ planta 1: oscuridad total, la fundición apagada     [oscuridad + luces]
       └─ duel-4 Midutech: Compilado
  └─ sótano: duel-5 Prototipo Cero (JEFE DE ACTO)
  └─ portal al Acto 8
```

### 5.3 Rivales

| Duelo | Rival | `difficulty` | Nivel | Mazo (idea) | Nexus / EXP |
| --- | --- | --- | --- | --- | --- |
| 1 | **Operario de Colada** | BOSS | 84 | fábrica: entidades pesadas + `exec-boost-atk-400` | 1500 / 760 |
| 2 | **Operario de Colada** | BOSS | 86 | igual + `trap-kernel-panic` | 1600 / 800 |
| 3 | **Alquimista** | MYTHIC | 88 | **fusiones**: los cinco compiladores del catálogo | 2400 / 1200 |
| 4 | **Midutech: Compilado** | MYTHIC | 90 | su mazo del Acto 4, recompilado y a nivel 90 | 2800 / 1400 |
| 5 | **Prototipo Cero** | MYTHIC | 93 | lo que sale de la cadena: fusión + robo + daño directo | 4000 / 2000 |

**Operario de Colada** (`opp-ch7-operario`) — no es hostil, es que no puedes pasar por su turno de
trabajo. **Alquimista** (`opp-ch7-alquimista`) — quien decide qué se fabrica; pelea fusionando sin
parar. **Midutech: Compilado** (`opp-ch7-midutech-prime`) — el mismo hombre del Acto 4, ahora con el
mazo que siempre quiso. **Prototipo Cero** (`opp-ch7-prototipo`) — la carta que se fabricó a sí
misma.

### 5.4 Cinemática firma — "La Colada"

Ante la boca de la cadena, con la cinta corriendo:

1. La cadena escupe una carta en el aire y la deja sobre la cinta.
2. Alquimista entra por la izquierda; Midutech por la derecha. No te ven.
3. Discuten **por encima de la cinta**, la carta pasando entre los dos.
4. Midutech alarga la mano y Alquimista **para la cinta** con un gesto.
5. Los dos giran la cabeza a la vez: sí que te habían visto.

## 6. Acto 8 — La Singularidad

**Ambiente:** `SINGULARITY`. **Mapa:** `act-8`, 40×40 (cuadrado y pequeño a propósito: no hay dónde
esconderse). **Entrada:** portal del Acto 7. **Cierra la campaña.**

### 6.1 Qué pasa

Un único espacio circular con el punto de convergencia en el centro. No hay laberinto ni puzzle: el
acto entero es **una escalera de duelos**, cada uno contra algo que ya conoces y que ahora forma
parte de otra cosa. La Entidad no aparece hasta el final, y cuando lo hace pelea en **tres fases**
sin dejarte salir entre ellas.

### 6.2 Flujo

```
spawn (portal del Acto 7)
  └─ E1 CINEMÁTICA FIRMA "El Coro": los cuatro jefes anteriores se funden
  └─ anillo exterior: cuatro pedestales, cuatro duelos en el orden que quieras
       ├─ duel-1 Coro: Kernel     (ecos de GenNvim)
       ├─ duel-2 Coro: Marea      (ecos del Leviatán)
       ├─ duel-3 Coro: Molde      (ecos del Prototipo)
       └─ duel-4 Coro: Espejo     (ecos del Reflejo)
  └─ los cuatro pedestales encendidos abren el centro
  └─ E2 cinemática: el descenso al punto
  └─ duel-5 La Entidad — Fase I    (MYTHIC 96)
  └─ duel-6 La Entidad — Fase II   (MYTHIC 98, sin volver al mapa)
  └─ duel-7 La Entidad — Fase III  (MYTHIC 100, versión 5, el duelo más duro del juego)
  └─ epílogo + cierre de campaña
```

### 6.3 Rivales

| Duelo | Rival | `difficulty` | Nivel | Mazo (idea) | Nexus / EXP |
| --- | --- | --- | --- | --- | --- |
| 1 | **Coro: Kernel** | MYTHIC | 90 | el mazo de GenNvim del Acto 4, subido | 2000 / 1000 |
| 2 | **Coro: Marea** | MYTHIC | 92 | enjambre + energía | 2100 / 1050 |
| 3 | **Coro: Molde** | MYTHIC | 92 | fusiones | 2200 / 1100 |
| 4 | **Coro: Espejo** | MYTHIC | 94 | robo e intercambio | 2300 / 1150 |
| 5 | **La Entidad I** | MYTHIC | 96 | control: anula y roba | 2600 / 1300 |
| 6 | **La Entidad II** | MYTHIC | 98 | agresión: todo entidades >1800 ATK | 3200 / 1600 |
| 7 | **La Entidad III** | MYTHIC | **100 / v5** | todo a la vez, sin cartas muertas | 6000 / 3000 |

### 6.4 Cinemática firma — "El Coro"

Nada más entrar, antes de poder moverte:

1. Cuatro NPCs se materializan en los cuatro pedestales: GenNvim, Leviatán, Prototipo, Reflejo.
2. Cada uno dice **media línea**; la frase solo se entiende leyendo las cuatro seguidas.
3. Se giran hacia el centro a la vez.
4. Se desmaterializan uno a uno, del más lejano al más cercano.
5. En el centro no aparece nada. Esa es la amenaza.

## 7. Checklist de implementación (por acto)

Cada acto es una tanda independiente que se puede mergear sola:

1. `Renderer2D`: paleta nueva + entrada en `resolveAmbientPalette`; `tilemap-schema` y
   `validate-tilemap` aceptan el ambiente nuevo.
2. `src/services/story/overworld/act-<N>-overworld-tilemap.ts` + su test de reachability.
3. `src/services/story/overworld/act-<N>-<escena>-cutscene.ts` + test de guion.
4. `src/services/story/map-definitions/act-<N>-map-definition.ts` + alta en el registro.
5. `resolve-overworld-tilemap.ts`: alta del mapId. `resolve-story-act-soundtrack-url.ts`: pista.
   `resolve-story-act-transition-target.ts`: transición del acto anterior.
6. El portal del acto anterior deja de ser "en construcción" y apunta al mapa nuevo.
7. `docs/supabase/sql/<161+N>_story_act<N>_*.sql`: oponentes, mazos, duelos, perfiles, overrides de
   nivel y recompensas.
8. `docs/story/acts/act-<N>/README.md` al día con lo que se ha construido de verdad.

## 7 bis. Dónde se desvió la implementación del diseño

Esta guía se escribió antes de construir nada. Al construirlo, cuatro cosas cambiaron. Manda lo
construido; se documenta aquí para que nadie "arregle" el código hacia el plan viejo.

| Diseño original | Lo que se construyó | Por qué |
|---|---|---|
| Acto 5 con oscuridad parcial y luces, como el Acto 3 | Tres **consolas-sello** en el atrio que abren la puerta del trono | `ambient` es una propiedad **del mapa entero**, no de una sala: bajo `MIRROR` no se puede oscurecer un tramo. Los sellos dan la misma función (recorrido obligado antes del jefe) y además cuentan la historia de la fuga. |
| Acto 6: cinco copias entrando **a la vez** | Entran **intercaladas**, una casilla por copia y ronda | El secuenciador de cutscenes es estrictamente secuencial. El round-robin se lee como cinco cuerpos moviéndose juntos y ligeramente desfasados — que era el efecto buscado. |
| Acto 7: el Alquimista como duelo con casilla propia | Nodo **fantasma** (`story-ch7-duel-3`), lanzado por la emboscada de "La Colada" | Su atrezzo ya ocupa la casilla y dos objetos no comparten celda. Además, el duelo así llega desde la escena en vez de estar plantado en el suelo. |
| Escena narrativa sin combate = caso especial | Registro `NARRATIVE_CUTSCENE_BY_TRIGGER_ID` en `OverworldDevScene` | Sólo había camino de conexión para cutscenes de emboscada (que exigen un duelo). "El Coro" del Acto 8 no lo tiene, así que se generalizó el `if` que había hardcodeado para el eco del Acto 1. |

Dos detalles más que cuestan una tarde si se descubren jugando:

- **`carveCorridor` no borra el atrezzo.** Talla sobre vacío, no sobre muro: abrir un pasillo a través
  de un `buildWall` deja un tramo por el que se anda pero que se sigue dibujando tapiado. Para eso está
  `carveThroughWall` en el build kit (lo usa el pozo del Acto 8).
- **Las cajas (`BOX`) y las placas (`PLATE`) NO se marcan sólidas**, y los NPCs de atrezzo de una escena
  con recorrido tampoco: el validador exige celda transitable para las primeras, y el BFS de la cutscene
  arranca en la casilla del NPC para los segundos.

## 8. Orden de despliegue

Las migraciones de contenido Story son **aditivas** (filas nuevas en catálogos que ya existen), así
que van **antes** del deploy, como las del paquete PvE y por el mismo motivo: el código nuevo lee
duelos que tienen que estar ahí. Y como siempre, antes de dar la entrega por cerrada, comparar
`supabase/migrations/` con el historial de producción **por nombre** — la lección del runbook de los
modos PvE ([despliegue-modos-pve.md](../../supabase/despliegue-modos-pve.md)).

### Historial de aplicación

| Migración | Producción (`fbnfveukgjnirjsmrbny`) | Local |
|---|---|---|
| `161_story_act5_core_invertido` | ✅ 2026-09-10 | ❌ (stack apagado) |
| `162_story_act6_red_abierta` | ✅ 2026-09-10 | ❌ |
| `163_story_act7_fundicion_cuantica` | ✅ 2026-09-10 | ❌ |
| `164_story_act8_singularidad` | ✅ 2026-09-10 | ❌ |
| `165_story_acts_5_8_dificultad` | ✅ 2026-09-10 | ❌ |

Se aplicaron a producción **antes** de desplegar el código —y no en local— porque el `.env.local` de
desarrollo apunta al Supabase de producción: jugando en local, el duelo del Acto 5 se busca allí. Tras
aplicarlas, producción tiene los 22 duelos de los capítulos 5-8, todos con perfil de IA y con overrides
de mazo (niveles 72→100). Si algún día se vuelve a jugar contra el Supabase local, hay que aplicarlas
con `pnpm db:migrate` (nunca `db:reset`).

### La corrección de dificultad (migración 165)

Las migraciones 161-164 dejaron los mazos de los Actos 5-8 **sin `attack_override`/`defense_override`**, es
decir con los stats pelados del catálogo (1263-1920 de ATK base de media), mientras que los rivales de los
Actos 1-4 sí los llevan (2000-2600). Y la curva de nivel sólo aporta **+150 ATK entre el nivel 72 y el 100**
(`card-level-bonus-rules.ts`: 20 hitos que suman +750/+750 al llegar a 100, y a nivel 72 ya van +600/+450).
Resultado: el primer rival del Acto 5 pegaba **menos** que el primero del Acto 4. La campaña se ablandaba
justo en el tramo final.

La 165 lo arregla sumando un **delta por duelo sobre el stat de catálogo** —no un número plano— para que la
identidad de cada carta se conserve dentro del mazo, y subiendo el nivel y el tier de versión acto a acto:

| Tramo | Nivel | Tier | ATK efectivo medio |
|---|---|---|---|
| Acto 4 (referencia) | 40-70 | 0-5 | 2250 → 2775 |
| Acto 5 | 75 → 87 | 3-4 | 2700 → 3180 |
| Acto 6 | 88 → 96 | 4-5 | 3000 → 3490 |
| Acto 7 | 96 → 100 | 5 | 3520 → 3910 |
| Acto 8 | 100 | 5 | 3640 → **4230** |

Sólo se tocan las **entidades**: magias y trampas no tienen ATK/DEF (de ellas sube el nivel, que es lo que
les rebaja el coste de energía a partir del 50).
