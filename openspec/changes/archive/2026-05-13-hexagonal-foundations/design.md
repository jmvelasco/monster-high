## Context

The web frontend at `apps/web/src/` currently uses a flat React architecture: components in `components/`, hooks in `hooks/`, types in `types/`, pages in `pages/`. The `frontend-patterns` skill mandates hexagonal architecture with vertical slices, domain entities, application use cases, and infrastructure adapters. This change creates the skeleton layers without touching UI.

## Goals / Non-Goals

**Goals:**
- Establish the `shared/domain/`, `shared/infrastructure/`, `characters/domain/`, and `characters/application/` folders.
- Implement `Maybe<T>` as the standard way to handle optional values.
- Move `generateSlug` into the domain layer.
- Create the Character domain entity and repository port.
- Create character use cases that components will eventually consume.
- Create a Factory skeleton that will be extended in later changes.

**Non-Goals:**
- Replacing SWR with React Query (Change 2).
- Creating store hooks, Context, or AppProviders (Changes 2-3).
- Moving any UI components (Change 3).

## Decisions

**Decision 1: `Maybe<T>` as a class with static constructors**
- `Maybe.some(value)`, `Maybe.none()`, `Maybe.fromNullable(value)`
- Instance methods: `fold`, `map`, `flatMap`, `getOrThrow`, `isSome`, `isNone`
- Rationale: `frontend-patterns` skill requires `Maybe<T>` for optional value handling. A class with methods allows fluent chaining.

**Decision 2: Character stays as an interface (not a class)**
- The Character type is read-only data fetched from a JSON API. It has no behavior to encapsulate.
- We move it to `characters/domain/Character.ts` but keep it as an interface (not an anemic class).
- Rationale: coding-standards say "Avoid anemic models" — a class without behavior IS anemic. An interface is honest about its nature as a data contract.

**Decision 3: Use Cases receive repository via constructor**
- `ListCharactersUseCase` and `FindCharacterBySlugUseCase` take `CharacterRepository` in constructor.
- Each has an `execute()` method.
- Rationale: follows hexagonal dependency inversion. The port (interface) lives in domain, the adapter in infrastructure.

**Decision 4: HttpCharacterRepository fetches from `/api/characters.json`**
- Wraps the existing `fetch` call currently inside `useCharacters.ts`.
- Returns `Character[]` from the JSON endpoint.
- Rationale: extracts infrastructure concern from hooks into a proper adapter.

**Decision 5: Factory is a static class**
- `Factory.createListCharactersUseCase()`, `Factory.createFindCharacterBySlugUseCase()`
- Internally creates `HttpCharacterRepository` and injects it.
- Rationale: follows `frontend-patterns` skill pattern for dependency wiring.

## Risks / Trade-offs

- [Risk] Moving `slugUtils.ts` will break imports across the codebase.
  - *Mitigation*: Update all imports in the same commit. Run `npx tsc --noEmit` to verify.
- [Risk] New code is unused until Changes 2-3 wire it to the UI.
  - *Mitigation*: All new code has its own tests. It's valid, tested, and ready to consume.
