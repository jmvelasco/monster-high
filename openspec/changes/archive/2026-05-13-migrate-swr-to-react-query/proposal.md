## Why

The frontend currently uses SWR for data fetching. The `frontend-patterns` skill defines the store layer on React Query (`useQuery`, `useMutation`, `useQueryClient`), including cache invalidation patterns that SWR doesn't support natively. This change swaps SWR for React Query, creates the `AppProviders` composition root, and sets up the Context-based DI pattern — all prerequisites before modules can adopt the full store layer.

## What Changes

- Replace `swr` with `@tanstack/react-query` as the data fetching/caching library.
- Update `main.tsx`: replace `SWRConfig` with `QueryClientProvider`.
- Rewrite `useCharacters` and `useCharacter` hooks temporarily using React Query (keeping the same public API so pages don't break).
- Create `AppProviders.tsx` skeleton in `shared/infrastructure/ui/`.
- Create `CharacterUseCases.context.ts` for dependency injection.

## Capabilities

### New Capabilities
_(none — this is a library swap + DI infrastructure)_

### Modified Capabilities
_(none — external behavior stays the same)_

## Impact

- **package.json**: Remove `swr`, add `@tanstack/react-query`.
- **main.tsx**: Entry point changes.
- **hooks/**: `useCharacters.ts` and `useCharacter.ts` rewritten internally.
- **New files**: `AppProviders.tsx`, `CharacterUseCases.context.ts`.
- **No UI changes**: Pages and components continue working unchanged.

## Non-goals

- Creating the full store layer (`Character.queries.ts`) — that's Change 3.
- Moving components to `infrastructure/ui/` — that's Change 3.
- Touching the friends module — that's Change 4.
- Applying component pattern fixes (no-destructuring, etc.) — that's Change 3-4.

## Pre-requisites

- **Change 1 (hexagonal-foundations)** must be completed. This change uses: `Factory`, `ListCharactersUseCase`, `FindCharacterBySlugUseCase`, `CharacterRepository`.
