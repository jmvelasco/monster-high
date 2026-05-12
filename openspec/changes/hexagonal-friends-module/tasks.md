## Pre-requisite

⚠️ **Change 2 (migrate-swr-to-react-query) must be completed before starting this change.**
Change 3 (hexagonal-characters-module) is NOT required — this can run in parallel.

## 1. Application Layer — Use Cases

📐 **Skill**: `frontend-patterns` → application layer, `coding-standards` → SRP
🔁 **TDD**: REASON → RED → GREEN → REFACTOR → RE-EVALUATE per use case

- [ ] 1.1 Create `apps/web/src/friends/application/ListFriendGroupsUseCase.ts` — receives `FriendGroupRepository`, `execute()` returns `Promise<FriendGroup[]>`.
- [ ] 1.2 Create `apps/web/src/friends/application/FindFriendGroupBySlugUseCase.ts` — `execute(slug)` returns `Promise<FriendGroup | null>`.
- [ ] 1.3 Create `apps/web/src/friends/application/CreateFriendGroupUseCase.ts` — `execute(name)` creates a group with `crypto.randomUUID()` and saves via repository.
- [ ] 1.4 Create `apps/web/src/friends/application/AddMemberToGroupUseCase.ts` — `execute(slug, groupId)` finds group, calls `addMember`, saves.
- [ ] 1.5 Create `apps/web/src/friends/application/RemoveMemberFromGroupUseCase.ts` — `execute(slug, groupId)` finds group, calls `removeMember`, saves.
- [ ] 1.6 Create `apps/web/src/friends/application/DeleteFriendGroupUseCase.ts` — `execute(groupId)` deletes via repository.

## 2. Move Domain and Infrastructure to `friends/`

🔧 **Refactor**: relocate existing files

- [ ] 2.1 Move `apps/web/src/domain/friends/FriendGroup.ts` → `apps/web/src/friends/domain/FriendGroup.ts`. Update all imports.
- [ ] 2.2 Move `apps/web/src/domain/friends/FriendGroupRepository.ts` → `apps/web/src/friends/domain/FriendGroupRepository.ts`. Update imports.
- [ ] 2.3 Move `apps/web/src/infrastructure/friends/LocalStorageFriendGroupRepository.ts` → `apps/web/src/friends/infrastructure/persistence/LocalStorageFriendGroupRepository.ts`. Update imports.
- [ ] 2.4 Move domain and infrastructure tests to `apps/web/src/friends/tests/unit/`. Delete empty `domain/friends/` and `infrastructure/friends/` folders.
- [ ] 2.5 Run `npx tsc --noEmit --project apps/web/tsconfig.json` to verify.

## 3. Context + Store Layer

📐 **Skill**: `frontend-patterns` → store reference, Context for DI
🔁 **TDD** for store hooks

- [ ] 3.1 Create `apps/web/src/friends/infrastructure/context/FriendGroupUseCases.context.ts` — Context with all 6 use cases. Export `FriendGroupUseCasesProvider` and `useFriendGroupUseCases()`.
- [ ] 3.2 Create `apps/web/src/friends/infrastructure/store/FriendGroup.queries.ts` — `useFriendGroupsQuery()` exposing `groups()`, `hasGroups()`, `findBySlug(slug): Maybe<FriendGroup>`, `isLoading`, `errorMessage()`.
- [ ] 3.3 Create `apps/web/src/friends/infrastructure/store/FriendGroup.mutations.ts` — `useFriendGroupMutations()` exposing `create`, `addMember`, `removeMember`, `deleteGroup`. Each invalidates `friendGroups` query key on success.
- [ ] 3.4 Update `apps/web/src/shared/infrastructure/ui/AppProviders.tsx` — add `friendGroupUseCases` prop, wrap with `FriendGroupUseCasesProvider`.
- [ ] 3.5 Update `apps/web/src/shared/infrastructure/Factory.ts` — add factory methods for all 6 friend group use cases.

## 4. Move UI to `friends/infrastructure/ui/`

📐 **Skills**: `frontend-patterns` → component patterns, Wired Page
🔧 **Refactor + pattern alignment**

- [ ] 4.1 Move `GroupSelector` → `friends/infrastructure/ui/GroupSelector/GroupSelector.tsx` + `.module.css`. Apply patterns (no destructuring, `props.x`). Move test.
- [ ] 4.2 Convert `FriendGroupsPage` → Wired Page in `friends/infrastructure/ui/FriendGroupsPage.tsx`. Use store hooks. Apply patterns. Move test.
- [ ] 4.3 Convert `FriendGroupDetailPage` → Wired Page in `friends/infrastructure/ui/FriendGroupDetailPage.tsx`. Use store hooks + mutations. Consolidate multiple `useState` into single state. Apply patterns. Move test.
- [ ] 4.4 Update `App.tsx` route imports.

## 5. Cleanup

- [ ] 5.1 Delete `apps/web/src/hooks/useFriendGroups.ts` and its test.
- [ ] 5.2 Delete `apps/web/src/components/friends/` folder.
- [ ] 5.3 Delete `apps/web/src/pages/FriendGroupsPage.tsx`, `FriendGroupDetailPage.tsx` and their CSS modules.
- [ ] 5.4 Delete empty folders: `domain/`, `infrastructure/`, `pages/` (if empty after this).
- [ ] 5.5 Run `npx tsc --noEmit --project apps/web/tsconfig.json`.

## 6. Validation

- [ ] 6.1 Run `npm run validate --workspace=apps/web`. All tests pass.
- [ ] 6.2 Run `npm run format:fix`.
