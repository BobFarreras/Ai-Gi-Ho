# SYSTEM RULES & GUIDELINES (Agents.md)

## 1. Language Policy (The "English-Code, Spanish-Docs" Rule)
* **Codebase:** All filenames, variables, functions, classes, and types MUST be written in **English**. 
* **Documentation & UI:** All code comments, JSDoc blocks, `README.md`, architecture documents, and user-facing text (UI) MUST be written in **Spanish**.

## 2. Typing & TypeScript Strictness
* **Zero `any` Tolerance:** The use of `any` is strictly forbidden. Use strict typing, generics, or `unknown` (with type narrowing).
* Interfaces must start with an uppercase 'I' (e.g., `ICard`, `IUserRepository`) if representing abstract contracts, or follow standard entity naming (e.g., `Card`).

## 3. Architecture & SOLID Principles
* **Repository Pattern:** UI components (React) and API routes MUST NOT interact with the database (Supabase) directly. They must use Repositories via dependency injection or service classes.
* **Separation of Concerns:** Business logic belongs in the `core/` or `services/` directory, NEVER inside React components.

## 4. Next.js App Router Rules
* Default to **Server Components**. Only use `"use client"` when interactivity (hooks like `useState`, `useEffect`, or DOM events) is strictly required.
* Data fetching should happen on the server side whenever possible.

## 5. TDD & Testing
* Follow the Red-Green-Refactor cycle.
* No feature is considered complete without unit tests (Vitest) for business logic and component tests (React Testing Library) for UI.

## 6. Error Handling
* Do not use generic `console.log()` for errors in production.
* Create custom Error classes (e.g., `DatabaseError`, `ValidationError`) and handle them gracefully in the UI with toast notifications or error boundaries.

## 7. Calidad del Código y Deuda Técnica (Zero Technical Debt)
* **Nivel de Experiencia:** Actúa siempre como un Staff Software Engineer experto en Next.js, TypeScript y Clean Architecture.
* **Cero Deuda Técnica:** No propongas "soluciones rápidas" o "parches" temporales. Si una implementación requiere refactorizar una interfaz previa para ser robusta, hazlo.
* **Co-location (Tests y Componentes):** Los tests unitarios (`*.test.ts`, `*.test.tsx`) DEBEN colocarse en el mismo directorio que el archivo que están evaluando, nunca en una carpeta separada y aislada de `/tests`.