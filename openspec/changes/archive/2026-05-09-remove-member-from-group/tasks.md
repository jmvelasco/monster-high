## 1. Domain Layer Refactoring

- [x] 1.1 Refactor `FriendGroup` from interface to `class` and update `FriendGroup.test.ts` to assert class instantiation.
- [x] 1.2 Implement `FriendGroup.fromPrimitives` static factory in `FriendGroup` and write/update tests to ensure proper rehydration.
- [x] 1.3 Implement `addMember` method in `FriendGroup` class via TDD and update tests.
- [x] 1.4 Implement `removeMember` method in `FriendGroup` class via TDD and update tests.
- [x] 1.5 Clean up legacy `createFriendGroup` factory if no longer needed, updating any related domain tests.

## 2. Infrastructure Layer Update

- [x] 2.1 Update `LocalStorageFriendGroupRepository` to map stored JSON data back to `FriendGroup` class instances using `fromPrimitives`.
- [x] 2.2 Update `LocalStorageFriendGroupRepository.test.ts` to ensure it returns valid `FriendGroup` class instances and correctly persists class instances.

## 3. Application Layer (React Hook) Update

- [x] 3.1 Update `useFriendGroups` hook's `addCharacterToGroup` to use the new `group.addMember(slug)` method instead of manual array manipulation.
- [x] 3.2 Implement `removeCharacterFromGroup` in `useFriendGroups` hook, which calls `group.removeMember(slug)` and saves via repository.
- [x] 3.3 Update `useFriendGroups.test.ts` to reflect the new behavior and integration.

## 4. UI Integration

- [x] 4.1 Refactor `CharacterCard` using Vercel Composition Patterns (Compound Components or `children` instead of render props), ensuring the action area is separated from the main `<Link>`.
- [x] 4.2 Update `FriendGroupDetailPage` to render the "Remove" button inside the `CharacterCard` using the new composition API.
- [x] 4.3 Implement double confirmation in `FriendGroupDetailPage` using `ConfirmDialog` to prompt the user before executing the removal.
- [x] 4.4 Connect the confirmed action to the `removeCharacterFromGroup` hook function and verify the UI updates correctly.
