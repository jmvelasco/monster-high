## Context

The current `FriendGroup` implementation in `apps/web/src/domain/friends/` is essentially an anemic data model (a TypeScript interface). All business logic for adding members is scattered across the application layer in the `useFriendGroups` React hook. The existing system doesn't support member removal. Moving forward, the project's coding standards mandate rich models (`coding-standards.md`) and strict adherence to Tell, Don't Ask principles.

## Goals / Non-Goals

**Goals:**
- Add the ability to remove characters from a friend group.
- Transform `FriendGroup` into a Rich Domain Model class.
- Encapsulate data mutations inside the Domain entity using pure commands.
- Transparently hydrate this entity when fetching data from LocalStorage.

**Non-Goals:**
- Implementing drag-and-drop character sorting.
- Extending group limits or handling pagination of members within the UI.
- Migrating to a remote database (keeping `LocalStorageFriendGroupRepository`).

## Decisions

**Decision 1: Converting `FriendGroup` to a Class**
- *Rationale*: We must encapsulate the internal state (`members` array) and provide commands to mutate it securely without exposing it to the UI directly.
- *Alternatives*: Using pure functions that take a `FriendGroup` interface and return a new interface instance. While this is functional, a class maps better to the "Tell, Don't Ask" principle as explicitly outlined in our `coding-standards.md`.

**Decision 2: Factory Method for Rehydration**
- *Rationale*: `LocalStorage` returns simple JSON objects. We need a way to restore the `FriendGroup` instance from storage. A static factory `FriendGroup.fromPrimitives(...)` will be added to create the class from plain data objects.

**Decision 3: Internal Array Immutability**
- *Rationale*: As per `coding-standards.md` ("Treat collections as immutable"), the `removeMember` method will mutate the class property but by assigning a new filtered array: `this._members = this._members.filter(m => m !== slug)`.
- *Alternatives*: Using `.splice()` which is forbidden by the coding standards.

**Decision 4: UI Refactoring using Vercel Composition Patterns**
- *Rationale*: To allow safe button injection and avoid invalid HTML (nested interactive elements) when placing a "Remove" button inside the `CharacterCard`, we will refactor `CharacterCard` following the `vercel-composition-patterns`. Specifically, we will prefer children over render props (`actionSlot`) and use a compound component pattern (e.g., `<CharacterCard.Root>`, `<CharacterCard.Image>`, `<CharacterCard.ActionArea>`) or a generic `children` wrapper. This avoids boolean/render props proliferation and creates a flexible API.
- *Alternatives*: Using a hardcoded `actionSlot` prop or `e.preventDefault()` on an absolutely positioned button. We reject `actionSlot` in favor of standard React composition patterns.

## Risks / Trade-offs

- [Risk] Existing data in `LocalStorage` might not match the expected schema if the previous shape differed.
  - *Mitigation*: The `fromPrimitives` factory will gracefully handle missing or undefined fields (falling back to empty arrays).
- [Risk] Hooks could retain stale references if state is mutated without triggering React renders properly.
  - *Mitigation*: Ensure `repository.save()` is followed by a `loadGroups()` call to fetch fresh objects and trigger React renders.
