## 1. Shared Domain — Maybe<T>

📐 **Skill**: `frontend-patterns` → Maybe Handling
🔁 **TDD**: REASON → RED → GREEN → REFACTOR → RE-EVALUATE per case

- [ ] 1.1 Create `apps/web/src/shared/domain/Maybe.ts` — implement `Maybe.none()` with `isSome()` returning false, `isNone()` returning true.
- [ ] 1.2 Implement `Maybe.some(value)` with `isSome()` returning true, value accessible.
- [ ] 1.3 Implement `Maybe.fromNullable(value)` — returns `None` for null/undefined, `Some` otherwise.
- [ ] 1.4 Implement `fold(onNone, onSome)` — executes the matching callback and returns its result.
- [ ] 1.5 Implement `map(fn)` — transforms the value if `Some`, returns `None` if `None`.
- [ ] 1.6 Implement `flatMap(fn)` — like `map` but the function returns a `Maybe`.
- [ ] 1.7 Implement `getOrThrow()` — returns value if `Some`, throws if `None`.

## 2. Shared Domain — slugUtils

📐 **Skill**: `coding-standards` → Constants close to usage, domain functions
🔧 **Refactor only** (no new behavior)

- [ ] 2.1 Move `apps/web/src/utils/slugUtils.ts` → `apps/web/src/shared/domain/slugUtils.ts`. Update all imports across the codebase. Run `npx tsc --noEmit` to verify. Delete the `utils/` folder if empty.

## 3. Characters Domain Layer

📐 **Skill**: `frontend-patterns` → hexagonal architecture, `coding-standards` → interfaces for data contracts
🔁 **TDD** for repository contract tests

- [ ] 3.1 Create `apps/web/src/characters/domain/Character.ts` — move the `Character`, `CharacterSections`, `CharacterSection`, `TechnicalInfo` interfaces from `types/character.ts`. Update all imports. Delete `types/` folder if empty.
- [ ] 3.2 Create `apps/web/src/characters/domain/CharacterRepository.ts` — interface with `findAll(): Promise<Character[]>` and `findBySlug(slug: string): Promise<Character | null>`.

## 4. Characters Infrastructure — HttpCharacterRepository

📐 **Skill**: `frontend-patterns` → infrastructure adapters
🔁 **TDD**: test the adapter with a fake/stub fetch (ask Tech Lead before using mocks)

- [ ] 4.1 Create `apps/web/src/characters/infrastructure/api/HttpCharacterRepository.ts` implementing `CharacterRepository`. Extracts the fetch logic currently in `useCharacters.ts`.

## 5. Characters Application — Use Cases

📐 **Skill**: `frontend-patterns` → application layer, `coding-standards` → SRP
🔁 **TDD**: REASON → RED → GREEN → REFACTOR → RE-EVALUATE per case

- [ ] 5.1 Create `apps/web/src/characters/application/ListCharactersUseCase.ts` — receives `CharacterRepository`, `execute()` returns `Promise<Character[]>`.
- [ ] 5.2 Create `apps/web/src/characters/application/FindCharacterBySlugUseCase.ts` — receives `CharacterRepository`, `execute(slug)` returns `Promise<Character | null>`.

## 6. Shared Infrastructure — Factory

📐 **Skill**: `frontend-patterns` → Factory pattern for DI
🔧 **No TDD** (wiring-only, no logic)

- [ ] 6.1 Create `apps/web/src/shared/infrastructure/Factory.ts` — static methods `createListCharactersUseCase()` and `createFindCharacterBySlugUseCase()`. Internally creates `HttpCharacterRepository` and injects it.

## 7. Validation

- [ ] 7.1 Run `npm run validate` in the web workspace. All existing tests pass, no compilation errors.
- [ ] 7.2 Run `npm run format:fix` to ensure code formatting.
