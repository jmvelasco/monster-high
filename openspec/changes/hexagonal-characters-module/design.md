## Context

Changes 1-2 established the hexagonal foundation and swapped SWR for React Query. The characters module now has domain, application, and infrastructure layers — but UI components still live in the legacy `components/` folder and hooks expose raw React Query internals.

## Goals / Non-Goals

**Goals:**
- Create `Character.queries.ts` store hook that encapsulates React Query behind domain-meaningful APIs.
- Move all character components to `characters/infrastructure/ui/` with proper folder structure (one folder per component).
- Convert `CharacterListPage` and `CharacterDetailPage` to the Wired Page pattern.
- Apply all `frontend-patterns` component rules systematically.
- Delete temporary bridge hooks.
- Move tests to `characters/tests/unit/`.

**Non-Goals:**
- Friends module (Change 4).
- Shared UI components (Change 5).

## Decisions

**Decision 1: Store hook exposes domain helpers, not React Query internals**
- `characters()` returns `Character[]`, `findBySlug(slug)` returns `Maybe<Character>`.
- `isLoading` is the only React Query property exposed directly.
- Components never see `data`, `error`, `isError`, `isSuccess`.

**Decision 2: Wired Page pattern for pages**
- `CharacterListWiredPage` uses Factory + AppProviders to wire deps.
- `CharacterListPage` is the testable presentational component using store hooks.
- Same pattern for `CharacterDetailPage`.

**Decision 3: Component pattern alignment applied during move**
- When moving each component, simultaneously apply: no destructuring, `props.x`, `hook.property`, CSS `composes`, single className per element.
- This avoids a separate "fix patterns" pass.

**Decision 4: `CharacterCard` variant via `composes` not template literals**
- Current: `` `${styles.card} ${styles.cardFavorite}` ``
- Target: `styles.cardFavorite` with `composes: card` in CSS.

## Risks / Trade-offs

- [Risk] Moving many files in one change could create merge conflicts with any parallel work.
  - *Mitigation*: This should be done on a clean branch with no parallel changes.
- [Risk] Test imports will all break when files move.
  - *Mitigation*: Move tests together with components, update imports, verify with `npx tsc --noEmit`.
