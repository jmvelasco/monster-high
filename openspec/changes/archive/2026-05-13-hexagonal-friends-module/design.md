## Context

The friends module has the best domain model in the app (`FriendGroup` class with `addMember`/`removeMember`), but the hook `useFriendGroups` is a monolith that instantiates the repository directly, uses `useCallback` (prohibited), and manages state manually. This change applies the same hexagonal pattern established in Changes 1-3.

## Goals / Non-Goals

**Goals:**
- Create one Use Case per operation (CRUD + add/remove member + find by slug).
- Create Context, store hooks (queries + mutations), wire into AppProviders and Factory.
- Move all friend UI components to `friends/infrastructure/ui/`.
- Apply all component pattern rules.
- Delete the monolithic `useFriendGroups` hook.
- Reorganize persistence adapter location.

**Non-Goals:**
- Adding new features to friend groups.
- Changing from LocalStorage to another persistence mechanism.
- Shared UI components (Change 5).

## Decisions

**Decision 1: One Use Case per operation**
- `ListFriendGroupsUseCase.execute()` → `FriendGroup[]`
- `FindFriendGroupBySlugUseCase.execute(slug)` → `FriendGroup | null`
- `CreateFriendGroupUseCase.execute(name)` → `void`
- `AddMemberToGroupUseCase.execute(slug, groupId)` → `void`
- `RemoveMemberFromGroupUseCase.execute(slug, groupId)` → `void`
- `DeleteFriendGroupUseCase.execute(groupId)` → `void`
- Rationale: SRP, each use case does exactly one thing.

**Decision 2: Mutations invalidate queries on success**
- `FriendGroup.mutations.ts` invalidates the `friendGroups` query key after each mutation.
- Components don't need to manually reload — React Query handles it.
- This eliminates the current `loadGroups()` calls after every mutation.

**Decision 3: `FriendGroupDetailPage` state consolidation**
- Current page has 4 separate `useState` calls. Consolidate into a single state object per the hook pattern.
- Page-level state (confirmDialog open, characterToRemove) can stay in the page component since it's pure UI state.

**Decision 4: Repository stays in `friends/infrastructure/persistence/`**
- Not `friends/infrastructure/storage/` — "persistence" is more semantically accurate.

## Risks / Trade-offs

- [Risk] `useFriendGroups` tests will need complete rewrite since the interface changes fundamentally.
  - *Mitigation*: Write new store hook tests, then delete old hook tests.
