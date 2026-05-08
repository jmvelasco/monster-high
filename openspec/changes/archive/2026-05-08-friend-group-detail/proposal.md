## Why

The current implementation of friend groups lacks a way to view the contents (characters) of a specific group. Furthermore, the UX for deleting a group is sub-optimal: the delete button is placed directly on the group card, increasing the risk of accidental clicks, and it lacks a confirmation step. This change introduces a dedicated detail view for each group to improve navigation, and moves the deletion action into this detail view with a proper confirmation dialog, resulting in a cleaner and safer user experience.

## What Changes

- Create a new `FriendGroupDetailPage` accessible via a friendly URL (slug based on the group name, e.g., `/friends/mis-favs`).
- Remove the "Eliminar" (delete) button from the group cards in the `FriendGroupsPage`.
- Make the entire group card clickable, navigating the user to the group's detail page.
- Add a "Delete Group" action inside the `FriendGroupDetailPage` header.
- Introduce a confirmation dialog (modal) that appears when the user attempts to delete a group from the detail page.
- Add a `slug` property to the `FriendGroup` domain entity, generated from the name upon creation.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `friend-groups`: The requirements for navigating friend groups and deleting them are changing. A detail view is being added, and the deletion flow now requires navigating to this detail view and confirming the action.

## Impact

- **Domain (`apps/web/src/domain/friends`)**: `FriendGroup` entity and its factory (`createFriendGroup`) will be updated to include and generate a `slug`.
- **Infrastructure (`apps/web/src/infrastructure/friends`)**: The repository implementation will need to handle fetching groups by slug, or the application hook will need to find the group by slug after loading.
- **Application/Hooks (`apps/web/src/hooks/useFriendGroups`)**: Needs support to fetch a specific group by slug.
- **UI/Pages (`apps/web/src/pages` & `apps/web/src/App.tsx`)**: `FriendGroupsPage` will be simplified. `FriendGroupDetailPage` will be added. Routes will be updated in `App.tsx`.
- **UI/Components (`apps/web/src/components`)**: A new `ConfirmDialog` component will be created or an existing one reused.

## Non-goals

- Implementing editing functionality for the group's name or its members (adding/removing characters from the detail page) in this specific change. This change focuses strictly on viewing details and safe deletion.
