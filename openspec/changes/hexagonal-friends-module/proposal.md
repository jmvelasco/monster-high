## Why

The friends module already has a rich domain model (`FriendGroup` class) and a repository adapter (`LocalStorageFriendGroupRepository`), but lacks the application layer (Use Cases) and the store layer. The `useFriendGroups` hook directly instantiates the repository (violating hexagonal dependency rules), uses `useCallback` (prohibited), and mixes state management with business logic. This change completes the friends vertical slice with proper hexagonal architecture.

## What Changes

- Create Use Cases: `CreateFriendGroupUseCase`, `ListFriendGroupsUseCase`, `FindFriendGroupBySlugUseCase`, `AddMemberToGroupUseCase`, `RemoveMemberFromGroupUseCase`, `DeleteFriendGroupUseCase`.
- Create `FriendGroupUseCases.context.ts` for DI.
- Create `FriendGroup.queries.ts` and `FriendGroup.mutations.ts` store hooks.
- Wire into `AppProviders` and `Factory`.
- Move `GroupSelector` → `friends/infrastructure/ui/GroupSelector/`.
- Convert `FriendGroupsPage` and `FriendGroupDetailPage` to Wired Pages in `friends/infrastructure/ui/`.
- Move `LocalStorageFriendGroupRepository` → `friends/infrastructure/persistence/`.
- Apply all component patterns (no destructuring, `props.x`, single state, etc.).
- Delete `useFriendGroups.ts` hook.
- Move tests to `friends/tests/unit/`.

## Capabilities

### New Capabilities
_(none — restructuring existing functionality)_

### Modified Capabilities
_(none — external behavior stays the same)_

## Impact

- **New files**: ~8 use cases + context + store hooks.
- **Moved files**: Components, pages, repository adapter, tests.
- **Deleted files**: `hooks/useFriendGroups.ts`, old page/component locations.
- **Modified files**: `AppProviders.tsx`, `Factory.ts`, `App.tsx`.

## Non-goals

- Adding new friend group features.
- Changing the storage mechanism (staying with LocalStorage).
- Shared UI changes (Change 5).

## Pre-requisites

- **Change 2 (migrate-swr-to-react-query)** must be completed (for React Query infrastructure).
- Change 3 is NOT required — can be done in parallel or in any order after Change 2.
