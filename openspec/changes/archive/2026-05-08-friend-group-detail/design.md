## Context

The `FriendGroup` entity currently relies on its `id` for internal identification, but the UI needs a friendly URL for the new detail page (`/friends/<slug>`). This requires enhancing the domain model to support slugs and updating the infrastructure layer to query by slug. Additionally, a new UI view is required to display the details of a group and safely handle its deletion via a confirmation modal.

## Goals / Non-Goals

**Goals:**
- Add `slug` capability to the `FriendGroup` domain entity.
- Provide a detail view for friend groups matching the aesthetic of the main application.
- Implement a reusable confirmation modal for destructive actions.
- Move the group deletion flow completely to the detail view.

**Non-Goals:**
- Implement the ability to rename groups (out of scope for this change).
- Implement the ability to edit group members from the detail view (out of scope).

## Decisions

### 1. Slugs in the Domain Layer
**Decision:** Enhance `FriendGroup` to include a `slug` property.
**Rationale:** The slug is an essential piece of identifying data for routing in the UI. Generating it at the time of creation (in `createFriendGroup`) ensures it is stable and always derived correctly from the initial name. We will utilize the existing `generateSlug` utility (`src/utils/slugUtils.ts`).
**Alternatives:** Generating the slug dynamically in the UI based on the name. *Rejected* because name changes (in the future) could break URLs if the slug isn't persisted, and it spreads routing logic outside of the core data model.

### 2. Infrastructure Querying
**Decision:** Add `findBySlug(slug: string): Promise<FriendGroup | null>` to the `FriendGroupRepository` interface and its `LocalStorageFriendGroupRepository` implementation.
**Rationale:** The UI needs an efficient way to fetch a single group by its URL parameter. Since this is hexagonal architecture, the repository pattern must define the contract for this data retrieval.
**Alternatives:** Filtering the array of all groups in the application layer or React hook. *Rejected* because data access logic should be encapsulated in the infrastructure layer.

### 3. State Management for Detail View
**Decision:** Create a new custom hook `useFriendGroupDetail(slug: string)` (or add `findBySlug` to the existing `useFriendGroups`) that manages the state of a single group.
**Rationale:** Keeps the component logic clean and separated from data fetching. Given that `useFriendGroups` currently manages the list and actions, adding a query method there might be the simplest approach, but a dedicated hook `useFriendGroupDetail` would better isolate the state for the detail page.

### 4. Delete Confirmation UX
**Decision:** Build a custom `ConfirmDialog` React component that renders a modal over the screen.
**Rationale:** The native `window.confirm` is detrimental to the "Premium UX" goal. A custom component allows for proper styling, animations, and adherence to the design system.

## Risks / Trade-offs

- **Risk:** Existing `FriendGroup` data in `LocalStorage` will not have a `slug` property, leading to broken navigation for legacy groups.
  - **Mitigation:** Update the `LocalStorageFriendGroupRepository` to handle data migration on the fly. When loading groups, if a group lacks a `slug`, generate one using `generateSlug(group.name)` and ideally persist it back.
