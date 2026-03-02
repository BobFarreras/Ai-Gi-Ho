# ARQUITECTURA DEL PROYECTO (Architecture.md)

Este proyecto sigue una arquitectura limpia (Clean Architecture) orientada a dominios, diseñada para desacoplar el framework (Next.js) y la base de datos (Supabase) de las reglas de negocio del juego.

## Estructura de Carpetas (`/src`)

```text
/src
 ├── app/                  # (Capa de Presentación - Framework)
 │   ├── api/              # Endpoints de la API REST / Webhooks
 │   ├── (auth)/           # Rutas de login/registro
 │   ├── game/             # Vistas de la partida
 │   └── layout.tsx        # Layout principal de Next.js
 │
 ├── components/           # (Capa de Presentación - UI)
 │   ├── ui/               # Componentes genéricos (Botones, Modales, Inputs)
 │   └── game/             # Componentes específicos del juego (Card, Board)
 │
 ├── core/                 # (Capa de Dominio - Lógica de Negocio Pura)
 │   ├── entities/         # Tipos e Interfaces base (ej. types para `Card`, `Player`)
 │   ├── interfaces/       # Contratos de repositorios (ej. `ICardRepository.ts`)
 │   └── use-cases/        # Lógica del juego independiente de React (ej. `AttackAction.ts`)
 │
 ├── infrastructure/       # (Capa de Infraestructura - Servicios Externos)
 │   ├── database/         # Implementaciones de repositorios (ej. `SupabaseCardRepository.ts`)
 │   └── ai/               # Clientes de la API de Gemini/LLMs
 │
 └── lib/                  # (Utilidades genéricas)
     └── utils.ts          # Funciones helpers puras (formateo de fechas, cn para Tailwind)
```

## Flujo de Datos (Cómo crear una nueva feature)
    Si queremos crear la acción de "Robar Carta":

    Core: Se define la interfaz en core/interfaces/ y la lógica pura en core/use-cases/.

    Infrastructure: Se implementa cómo se guarda esa acción en BD dentro de infrastructure/database/.

    App/Components: Se crea el botón en components/game/ que llama al caso de uso, sin saber que por debajo usa Supabase.