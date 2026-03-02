# Arquitectura del Proyecto

Arquitectura en capas orientada a dominio con separación estricta entre UI, motor de reglas, estrategia de oponente e integraciones externas.

## Estructura actual (`/src`)

```text
/src
 ├── app/                                  # Entradas Next.js (App Router)
 │   ├── layout.tsx
 │   └── page.tsx
 │
 ├── components/                           # Presentación React
 │   └── game/
 │       ├── board/
 │       │   ├── battlefield/              # Render de tablero y slots
 │       │   ├── hooks/
 │       │   │   ├── internal/             # Estado inicial, errores UI, loop oponente
 │       │   │   ├── useBoard.ts
 │       │   │   ├── useBoard.test.ts
 │       │   │   └── useBoard.integration.test.ts
 │       │   ├── ui/                       # Paneles de fase y timer
 │       │   ├── Board.test.tsx
 │       │   └── index.tsx
 │       └── card/
 │
 ├── core/
 │   ├── entities/                         # Tipos de dominio
 │   ├── errors/                           # AppError + códigos tipados
 │   ├── services/
 │   │   └── opponent/                     # IA heurística (sin LLM)
 │   └── use-cases/
 │       ├── game-engine/                  # Casos de uso modulares del motor
 │       ├── CombatService.ts
 │       └── GameEngine.ts                 # Fachada estable
 │
 ├── infrastructure/                       # Integraciones externas (pendiente)
 └── lib/
```

## Reglas de dependencia

1. `app` y `components` consumen `core`.
2. `core` no depende de `components` ni de `app`.
3. `core/services/opponent` depende de `core/use-cases` y `core/entities`.
4. `infrastructure` implementa contratos del dominio cuando se conecten APIs/DB.

## Flujo de turno actual

1. Jugador humano actúa en su turno (`activePlayerId = playerA.id`).
2. Al cerrar turno, `nextPhase` transiciona a turno rival.
3. `useOpponentTurn` ejecuta pasos automáticos del oponente (`runOpponentStep`).
4. Al terminar fase `END` rival, vuelve el control al jugador.

## Diseño para evolución

1. Estrategia actual: `HeuristicOpponentStrategy` (determinista con heurísticas).
2. Extensión futura LLM: nueva implementación de `IOpponentStrategy` sin tocar UI.
3. Multijugador futuro: sustitución del controlador rival por controlador remoto sin romper el motor.

## Documentación modular

1. `game-engine/README.md`: invariantes del motor y contratos.
2. `services/opponent/README.md`: decisiones del bot y dificultad.
3. `hooks/internal/README.md`: responsabilidades internas del tablero.
