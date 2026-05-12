## Pre-requisite

⚠️ **Change 1 (hexagonal-foundations) must be completed before starting this change.**

## 1. Library Swap

🔧 **No TDD** (configuration change)

- [x] 1.1 Run `npm uninstall swr --workspace=apps/web` and `npm install @tanstack/react-query --workspace=apps/web`.
- [x] 1.2 Update `apps/web/src/main.tsx`: replace `SWRConfig` import and wrapper with `QueryClientProvider` + `QueryClient` with `defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } }`.
- [x] 1.3 Run `npx tsc --noEmit --project apps/web/tsconfig.json` — expect compile errors only in hooks that import `swr`.

## 2. Context DI Infrastructure

📐 **Skill**: `frontend-patterns` → store reference (Context for DI)
🔧 **No TDD** (wiring-only)

- [x] 2.1 Create `apps/web/src/characters/infrastructure/context/CharacterUseCases.context.ts` — Context with `list: ListCharactersUseCase`, `findBySlug: FindCharacterBySlugUseCase`. Export `CharacterUseCasesProvider` and `useCharacterUseCases()`.
- [x] 2.2 Create `apps/web/src/shared/infrastructure/ui/AppProviders.tsx` — receives `characterUseCases` prop, wraps children in `CharacterUseCasesProvider`. Add `QueryClientProvider` here (move from `main.tsx`).
- [x] 2.3 Update `apps/web/src/main.tsx` to use `AppProviders` with `Factory.createListCharactersUseCase()` and `Factory.createFindCharacterBySlugUseCase()`.

## 3. Bridge Hooks (Temporary)

📐 **Skill**: `frontend-patterns` → hooks never access fetch
🔁 **TDD**: update existing hook tests to work with React Query

- [x] 3.1 Rewrite `apps/web/src/hooks/useCharacters.ts` — replace SWR with `useQuery` from React Query. Keep the same return type `{ data, error, isLoading }` for now.
- [x] 3.2 Rewrite `apps/web/src/hooks/useCharacter.ts` — replace SWR with `useQuery`. Keep same return type.
- [x] 3.3 Update hook tests (`useCharacters.test.tsx`, `useCharacter.test.tsx`) to work with React Query test utilities.

## 4. Validation

- [x] 4.1 Run `npm run validate --workspace=apps/web`. All tests pass, no compilation errors.
- [x] 4.2 Verify the app runs correctly in the browser: character list loads, character detail loads.
- [x] 4.3 Run `npm run format:fix`.
