## Context

After Change 1 (hexagonal-foundations), the app has Use Cases, Factory, and domain entities but still uses SWR in hooks that directly call `fetch`. This change bridges the gap by swapping the library and wiring up the DI infrastructure (Context + AppProviders).

## Goals / Non-Goals

**Goals:**
- Replace SWR with React Query across the web app.
- Create `QueryClient` configuration in `main.tsx`.
- Rewrite `useCharacters` and `useCharacter` to use `useQuery` internally (temporary — Change 3 replaces them with store hooks).
- Create `CharacterUseCases.context.ts` with `useCharacterUseCases()` hook.
- Create `AppProviders.tsx` that composes all Context providers.

**Non-Goals:**
- Full store layer (`Character.queries.ts`) — Change 3.
- Moving any UI files — Change 3.
- Friends module changes — Change 4.

## Decisions

**Decision 1: Temporary hooks as bridge**
- `useCharacters` and `useCharacter` are rewritten to use React Query internally but keep the same return shape.
- This avoids touching pages/components in this change.
- Change 3 will delete these and replace with proper store hooks.

**Decision 2: QueryClient configuration**
- `staleTime: 60_000` (matches current SWR `dedupingInterval`).
- `refetchOnWindowFocus: false` (matches current SWR config).

**Decision 3: AppProviders receives use cases as props**
- Follows `frontend-patterns` → store reference: `AppProviders` takes typed use case objects per module.
- Initially only `characterUseCases` prop.

## Risks / Trade-offs

- [Risk] Temporary hooks are a known intermediate state — they'll exist for one change only.
  - *Mitigation*: Change 3 explicitly removes them.
