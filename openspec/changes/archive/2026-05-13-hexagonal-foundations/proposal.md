## Why

The web app's frontend lacks the foundational domain and application layers required by hexagonal architecture. There is no `Maybe<T>` monad, no Use Cases, no Factory, no Character domain entity (only an anemic `types/character.ts`), and utility functions like `generateSlug` live in a `utils/` folder instead of the domain. This change creates the structural foundations that all subsequent hexagonal migration changes depend on.

## What Changes

- Create `Maybe<T>` monad in `shared/domain/` for safe optional value handling across the app.
- Move `generateSlug` from `utils/slugUtils.ts` to `shared/domain/slugUtils.ts` as a domain function.
- Create `Character` domain entity in `characters/domain/` replacing the anemic `types/character.ts` interface.
- Create `CharacterRepository` port (interface) in `characters/domain/`.
- Create `ListCharactersUseCase` and `FindCharacterBySlugUseCase` in `characters/application/`.
- Create `HttpCharacterRepository` adapter in `characters/infrastructure/api/`.
- Create `Factory` skeleton in `shared/infrastructure/Factory.ts`.
- Keep existing code working — new code is additive, old imports are updated but behavior is preserved.

## Capabilities

### New Capabilities
- `maybe-monad`: `Maybe<T>` type with `Some`/`None`, `fold`, `map`, `flatMap`, `getOrThrow`, `isSome`, `isNone`, `fromNullable` for safe optional handling.
- `character-domain`: Rich `Character` type and `CharacterRepository` port in the domain layer.
- `character-use-cases`: `ListCharactersUseCase` and `FindCharacterBySlugUseCase` application layer use cases.

### Modified Capabilities
_(none — this change is purely additive)_

## Impact

- **New files**: ~8-10 new files in `shared/` and `characters/` vertical slices.
- **Modified files**: `utils/slugUtils.ts` moved (imports updated across codebase).
- **No UI changes**: Existing pages and components continue working unchanged.
- **Dependencies**: No new npm packages required.

## Non-goals

- Migrating SWR to React Query (Change 2).
- Moving components to `infrastructure/ui/` (Change 3).
- Creating the store layer or Context DI (Change 2-3).
- Refactoring the `friends` module (Change 4).
- Touching any existing hooks, pages, or components beyond updating `slugUtils` imports.
