## Pre-requisite

⚠️ **Change 2 (migrate-swr-to-react-query) must be completed before starting this change.**

## 1. Store Layer

📐 **Skill**: `frontend-patterns` → store reference
🔁 **TDD**: REASON → RED → GREEN → REFACTOR → RE-EVALUATE

- [x] 1.1 Create `apps/web/src/characters/infrastructure/store/Character.queries.ts` — `useCharactersQuery()` wrapping `useQuery` with `useCharacterUseCases()` from Context. Expose: `isLoading`, `characters()`, `hasCharacters()`, `findBySlug(slug): Maybe<Character>`, `errorMessage()`.
- [x] 1.2 Write tests for the store hook verifying it exposes domain helpers and not raw React Query internals.

## 2. Move Components to `characters/infrastructure/ui/`

📐 **Skills**: `frontend-patterns` → component file structure, `coding-standards` → no destructuring
🔧 **Refactor**: move + apply patterns simultaneously

- [x] 2.1 Move `CharacterCard` → `characters/infrastructure/ui/CharacterCard/CharacterCard.tsx` + `.module.css`. Apply: `props.x`, no destructuring, CSS `composes` for variant (replace template literal class combination). Move test to `characters/tests/unit/CharacterCard.test.tsx`.
- [x] 2.2 Move `CharacterGrid` → `characters/infrastructure/ui/CharacterGrid/CharacterGrid.tsx` + `.module.css`. Apply patterns. Move test.
- [x] 2.3 Move `FriendThumbnails` → `characters/infrastructure/ui/FriendThumbnails/FriendThumbnails.tsx` + `.module.css`. Apply patterns. Move test.
- [x] 2.4 Move `CharacterDetail` → `characters/infrastructure/ui/CharacterDetail/CharacterDetail.tsx` + `.module.css`. Apply patterns. Refactor to use store hooks instead of direct hook calls. Move test.

## 3. Convert Pages to Wired Page Pattern

📐 **Skill**: `frontend-patterns` → Wired Page pattern
🔁 **TDD**: update page tests

- [x] 3.1 Create `characters/infrastructure/ui/CharacterListPage.tsx` as a Wired Page. `CharacterListWiredPage` uses Factory + AppProviders. `CharacterListPage` uses `useCharactersQuery()` store hook. Move and update tests.
- [x] 3.2 Create `characters/infrastructure/ui/CharacterDetailPage.tsx` as a Wired Page. `CharacterDetailWiredPage` uses Factory + AppProviders. `CharacterDetailPage` uses `useCharactersQuery().findBySlug()`. Move and update tests.
- [x] 3.3 Update `App.tsx` route imports to use the new Wired Page components.

## 4. Cleanup

🔧 **Housekeeping**

- [x] 4.1 Delete `apps/web/src/hooks/useCharacters.ts` and `apps/web/src/hooks/useCharacter.ts` (replaced by store hook).
- [x] 4.2 Delete `apps/web/src/hooks/__tests__/useCharacters.test.tsx` and `useCharacter.test.tsx`.
- [x] 4.3 Delete `apps/web/src/components/character/` folder (now empty).
- [x] 4.4 Delete `apps/web/src/pages/CharacterListPage.tsx` and `CharacterDetailPage.tsx` (moved).
- [x] 4.5 Run `npx tsc --noEmit --project apps/web/tsconfig.json` to verify no broken imports.

## 5. Validation

- [x] 5.1 Run `npm run validate --workspace=apps/web`. All tests pass.
- [x] 5.2 Run `npm run format:fix`.
