## Why

Currently, the friend group system in the web app allows adding characters to a group, but there is no mechanism to remove a character from a group once added. Additionally, the business logic for member management is currently anemic and lives within the `useFriendGroups.ts` hook. This change will introduce the member removal functionality while simultaneously refactoring the `FriendGroup` entity into a rich domain model with encapsulated behavior (`addMember`, `removeMember`), aligning with XP principles and the project's coding standards.

## What Changes

- Refactor `FriendGroup` from an interface to a rich Domain Class.
- Implement command methods `addMember(slug: string)` and `removeMember(slug: string)` inside the `FriendGroup` class.
- Add `fromPrimitives` factory method to rehydrate `FriendGroup` objects.
- Update `LocalStorageFriendGroupRepository` to reconstruct `FriendGroup` instances.
- Update the `useFriendGroups` hook to use the rich model methods and expose a `removeCharacterFromGroup` function.
- Refactor `CharacterCard` using Vercel Composition Patterns (e.g. Compound Components or generic children wrappers) to safely inject action buttons without nesting them in the main link.
- Update the group detail UI to include a "Remove" button for each character with a double confirmation dialog (`ConfirmDialog`).
- Update unit tests for `FriendGroup`, the repository, and the hook.

## Capabilities

### New Capabilities

### Modified Capabilities
- `friend-groups`: Adding the requirement to remove a character from an existing group, and changing the underlying domain model to be rich instead of anemic.

## Impact

- **Domain Layer:** `apps/web/src/domain/friends/FriendGroup.ts`
- **Infrastructure Layer:** `apps/web/src/infrastructure/friends/LocalStorageFriendGroupRepository.ts`
- **Application Layer:** `apps/web/src/hooks/useFriendGroups.ts`
- **UI:** `CharacterCard` will be refactored using Vercel Composition Patterns (Compound Components or children props). `FriendGroupDetailPage` will integrate the remove action and a double confirmation dialog.
- **Tests:** Unit tests across these layers will be updated.

## Non-goals
- Adding drag-and-drop character reordering.
- Managing multiple users' friend groups (auth/backend integration).
