## Pre-requisite

⚠️ **Change 2 (migrate-swr-to-react-query) must be completed before starting this change.**
Change 3 (hexagonal-characters-module) is NOT required — this can run in parallel.

## 1. Application Layer — Use Cases

📐 **Skill**: `frontend-patterns` → application layer, `coding-standards` → SRP
🔁 **TDD**: REASON → RED → GREEN → REFACTOR → RE-EVALUATE per use case

- [x] 1.1 Create `apps/web/src/friends/application/ListFriendGroupsUseCase.ts` — receives `FriendGroupRepository`, `execute()` returns `Promise<FriendGroup[]>`.
- [x] 1.2 Create `apps/web/src/friends/application/FindFriendGroupBySlugUseCase.ts` — `execute(slug)` returns `Promise<FriendGroup | null>`.
- [x] 1.3 Create `apps/web/src/friends/application/CreateFriendGroupUseCase.ts` — `execute(name)` creates a group with `crypto.randomUUID()` and saves via repository.
- [x] 1.4 Create `apps/web/src/friends/application/AddMemberToGroupUseCase.ts` — `execute(slug, groupId)` finds group, calls `addMember`, saves.
- [x] 1.5 Create `apps/web/src/friends/application/RemoveMemberFromGroupUseCase.ts` — `execute(slug, groupId)` finds group, calls `removeMember`, saves.
- [x] 1.6 Create `apps/web/src/friends/application/DeleteFriendGroupUseCase.ts` — `execute(groupId)` deletes via repository.

## 2. Move Domain and Infrastructure to `friends/`

🔧 **Refactor**: relocate existing files

- [x] 2.1 Move `apps/web/src/domain/friends/FriendGroup.ts` → `apps/web/src/friends/domain/FriendGroup.ts`. Update all imports.
- [x] 2.2 Move `apps/web/src/domain/friends/FriendGroupRepository.ts` → `apps/web/src/friends/domain/FriendGroupRepository.ts`. Update imports.
- [x] 2.3 Move `apps/web/src/infrastructure/friends/LocalStorageFriendGroupRepository.ts` → `apps/web/src/friends/infrastructure/persistence/LocalStorageFriendGroupRepository.ts`. Update imports.
- [x] 2.4 Move domain and infrastructure tests to `apps/web/src/friends/tests/unit/`. Delete empty `domain/friends/` and `infrastructure/friends/` folders.
- [x] 2.5 Run `npx tsc --noEmit --project apps/web/tsconfig.json` to verify.

## 3. Context + Store Layer

📐 **Skill**: `frontend-patterns` → store reference, Context for DI
🔁 **TDD** for store hooks

- [x] 3.1 Create `apps/web/src/friends/infrastructure/context/FriendGroupUseCases.context.ts` — Context with all 6 use cases. Export `FriendGroupUseCasesProvider` and `useFriendGroupUseCases()`.
- [x] 3.2 Create `apps/web/src/friends/infrastructure/store/FriendGroup.queries.ts` — `useFriendGroupsQuery()` exposing `groups()`, `hasGroups()`, `findBySlug(slug): Maybe<FriendGroup>`, `isLoading`, `errorMessage()`.
- [x] 3.3 Create `apps/web/src/friends/infrastructure/store/FriendGroup.mutations.ts` — `useFriendGroupMutations()` exposing `create`, `addMember`, `removeMember`, `deleteGroup`. Each invalidates `friendGroups` query key on success.
- [x] 3.4 Update `apps/web/src/shared/infrastructure/ui/AppProviders.tsx` — add `friendGroupUseCases` prop, wrap with `FriendGroupUseCasesProvider`.
- [x] 3.5 Update `apps/web/src/shared/infrastructure/Factory.ts` — add factory methods for all 6 friend group use cases.

## 4. Move UI to `friends/infrastructure/ui/`

📐 **Skills**: `frontend-patterns` → component patterns, Wired Page
🔧 **Refactor + pattern alignment**

- [x] 4.1 Move `GroupSelector` → `friends/infrastructure/ui/GroupSelector/GroupSelector.tsx` + `.module.css`. Apply patterns (no destructuring, `props.x`). Move test.
- [x] 4.2 Convert `FriendGroupsPage` → Wired Page in `friends/infrastructure/ui/FriendGroupsPage.tsx`. Use store hooks. Apply patterns. Move test.
- [x] 4.3 Convert `FriendGroupDetailPage` → Wired Page in `friends/infrastructure/ui/FriendGroupDetailPage.tsx`. Use store hooks + mutations. Consolidate multiple `useState` into single state. Apply patterns. Move test.
- [x] 4.4 Update `App.tsx` route imports.

## 5. Cleanup

- [x] 5.1 Delete `apps/web/src/hooks/useFriendGroups.ts` and its test.
- [x] 5.2 Delete `apps/web/src/components/friends/` folder.
- [x] 5.3 Delete `apps/web/src/pages/FriendGroupsPage.tsx`, `FriendGroupDetailPage.tsx` and their CSS modules.
- [x] 5.4 Delete empty folders: `domain/`, `infrastructure/`, `pages/` (if empty after this).
- [x] 5.5 Run `npx tsc --noEmit --project apps/web/tsconfig.json`.

## 6. Validation

- [x] 6.1 Run `npm run validate --workspace=apps/web`. All tests pass.
- [x] 6.2 Run `npm run format:fix`.
