# Specs: Friend Groups (Mis Amigas)

## Capability Overview
The Friend Groups capability allows users to organize characters into custom collections. This feature was evolved from the legacy "Favorites" system to support multiple named groups.

## User Scenarios

### Scenario 1: Creating a new friend group
**Given** a user is on the "Friend Groups" management page (Mis Amigas)
**When** they click "Create new group" and enter the name "Vampiras"
**Then** the system should create an empty group with that name and display it in the list.

#### Acceptance Criteria:
- Group name cannot be empty.
- Group ID must be unique (UUID).
- The new group appears immediately in the UI.

### Scenario 2: Adding a character to a group from detail page
**Given** a user is viewing the detail page for "Draculaura"
**When** they select the group "Vampiras" in the group selector
**Then** "Draculaura" should be added to the members list of that group.

#### Acceptance Criteria:
- Character is not duplicated if already in the group.
- Success feedback is shown to the user.

### Scenario 3: Migration of legacy favorites
**Given** a user has characters in their old favorites list
**When** they access the "/amigas" section for the first time
**Then** the system should automatically create a group named "BFFs" containing those characters.

#### Acceptance Criteria:
- Legacy list is removed after successful migration.
- No data loss during the transition.

### Scenario 4: Viewing friend group details
**Given** a user is on the "Friend Groups" management page
**When** they click on a specific group card (e.g., "Mis Favs")
**Then** they are navigated to the group's detail page (`/friends/mis-favs`)
**And** the page displays the name of the group and a list of characters belonging to that group.

#### Acceptance Criteria:
- The URL must be a human-readable slug derived from the group name.
- If a legacy group lacks a slug, the system dynamically generates one upon loading to ensure accessibility.

### Scenario 5: Deleting a friend group
**Given** a user is viewing a friend group's detail page
**When** they click the "Delete Group" action
**Then** a modal confirmation dialog is displayed warning about the destructive action.

#### Acceptance Criteria:
- Explicit confirmation is required to permanently remove the group.
- Canceling the deletion dialog leaves the group intact.
- Upon successful deletion, the user is redirected to the main "Friend Groups" list.
- Deleting the group does NOT remove the characters themselves from the global catalog.

## Technical Constraints & Edge Cases
- **Duplicate Names**: Multiple groups can share the same name but must have different IDs (though visual uniqueness is encouraged).
- **Empty Groups**: Groups can exist without any members.
- **Persistence**: Data is stored locally in the browser's LocalStorage.
