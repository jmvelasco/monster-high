## Why

After Changes 1-2, the app has domain entities, use cases, React Query, Context DI, and AppProviders — but components still live in `components/`, pages in `pages/`, and hooks expose raw React Query internals. This change completes the Characters vertical slice by creating the store layer, moving all character UI into `characters/infrastructure/ui/`, and applying all `frontend-patterns` component rules (no destructuring, `props.x`, single useState, etc.).

## What Changes

- Create `Character.queries.ts` store hook encapsulating React Query behind domain helpers.
- Move character components (`CharacterCard`, `CharacterGrid`, `CharacterDetail`, `FriendThumbnails`) into `characters/infrastructure/ui/` with proper folder structure.
- Convert pages to Wired Pages pattern (`CharacterListPage`, `CharacterDetailPage`).
- Apply all component patterns: no destructuring, `props.x`, `hook.property`, CSS `composes` instead of template literals.
- Delete temporary bridge hooks from Change 2.
- Move character tests to `characters/tests/unit/`.

## Capabilities

### New Capabilities
_(none — restructuring existing functionality)_

### Modified Capabilities
_(none — external behavior stays the same)_

## Impact

- **Moved files**: ~8 component files from `components/character/` → `characters/infrastructure/ui/`.
- **Moved files**: 2 page files from `pages/` → `characters/infrastructure/ui/`.
- **Deleted files**: `hooks/useCharacters.ts`, `hooks/useCharacter.ts` (replaced by store hook).
- **New files**: `Character.queries.ts` store hook.
- **Modified files**: All character components (pattern alignment).
- **Routes**: `App.tsx` imports updated.

## Non-goals

- Touching friends module (Change 4).
- Touching shared UI like Header, Layout, ConfirmDialog (Change 5).
- CSS variable renaming (Change 5).

## Pre-requisites

- **Change 2 (migrate-swr-to-react-query)** must be completed.
