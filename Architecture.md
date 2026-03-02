# Arquitectura del Proyecto (Architecture.md)

Este proyecto usa una arquitectura en capas orientada a dominio para mantener separadas la UI, la lógica del juego y las integraciones externas.

## Estructura real actual (`/src`)

```text
/src
 ├── app/                           # Entradas Next.js App Router
 │   ├── layout.tsx
 │   └── page.tsx
 │
 ├── components/                    # Presentación (React)
 │   └── game/
 │       ├── board/
 │       │   ├── battlefield/       # Subcomponentes del tablero 3D
 │       │   │   ├── BattlefieldZone.tsx
 │       │   │   ├── DigitalBeam.tsx
 │       │   │   └── SlotGrid.tsx
 │       │   ├── hooks/
 │       │   │   └── useBoard.ts    # Orquestación de interacción UI
 │       │   ├── ui/                # Widgets de HUD y control de fase
 │       │   │   ├── OpponentHandFan.tsx
 │       │   │   ├── PhasePanel.tsx
 │       │   │   └── TurnTimer.tsx
 │       │   ├── Battlefield.tsx
 │       │   ├── Board.test.tsx
 │       │   ├── PlayerHUD.tsx
 │       │   ├── PlayerHand.tsx
 │       │   ├── SidePanels.tsx
 │       │   └── index.tsx
 │       └── card/
 │           ├── Card.tsx
 │           ├── Card.test.tsx
 │           └── CardBack.tsx
 │
 ├── core/                          # Dominio y casos de uso puros
 │   ├── entities/
 │   │   ├── ICard.ts
 │   │   └── IPlayer.ts
 │   └── use-cases/
 │       ├── game-engine/           # Casos de uso del motor (modularizados)
 │       │   ├── change-entity-mode.ts
 │       │   ├── execute-attack.ts
 │       │   ├── next-phase.ts
 │       │   ├── play-card.ts
 │       │   ├── player-utils.ts
 │       │   ├── resolve-execution.ts
 │       │   └── types.ts
 │       ├── CombatService.ts
 │       └── GameEngine.ts          # Fachada estable para la app
 │
 ├── infrastructure/                # Adaptadores externos (pendiente de implementación)
 │   ├── ai/
 │   └── database/
 │
 └── lib/
     └── utils.ts
```

## Reglas de dependencia

1. `app` y `components` pueden consumir `core`.
2. `core` no importa desde `components`, `app` ni `infrastructure`.
3. `infrastructure` implementa contratos del dominio cuando se incorporen repositorios.
4. La fachada `GameEngine.ts` expone API estable y delega en módulos pequeños de `game-engine/`.

## Criterios anti-GOD aplicados

1. Ningún archivo funcional supera 150 líneas.
2. Se divide por responsabilidad: orquestación, render, reglas de combate, fases, etc.
3. Subcarpetas por contexto (`board/battlefield`, `board/ui`, `core/use-cases/game-engine`).

## Estrategia de documentación

No se recomienda un `README.md` en cada componente aislado.

Sí se recomienda documentar por **módulo funcional** cuando haya suficiente complejidad:

1. Un `README.md` en una carpeta de contexto (por ejemplo `core/use-cases/game-engine/`) cuando explique reglas, invariantes o decisiones.
2. Evitar README por componente visual pequeño porque genera ruido y deuda documental.
3. Mantener documentos raíz vivos (`Architecture.md`, `MOTOR_JUEGO.md`, `README.md`) y añadir documentación local solo donde aporte contexto técnico real.
