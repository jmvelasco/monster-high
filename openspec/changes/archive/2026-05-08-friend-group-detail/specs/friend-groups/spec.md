## ADDED Requirements

### Requirement: View Friend Group Details
The system SHALL provide a dedicated detail view for each friend group, accessible via a stable, human-readable URL (slug) derived from the group name. This view SHALL display the characters that are members of the group.

#### Scenario: Navigating to group details
- **GIVEN** a user is on the "Friend Groups" management page (`/friends`)
- **WHEN** they click on a specific group card (e.g., "Mis Favs")
- **THEN** they are navigated to the group's detail page (`/friends/mis-favs`)
- **AND** the page displays the name of the group and a list of characters belonging to that group.

#### Scenario: Legacy group accessed without a slug
- **GIVEN** an existing friend group in local storage that does not have a generated slug
- **WHEN** the system loads the groups
- **THEN** it SHALL dynamically generate a slug for that group based on its name to ensure the detail page is accessible.

### Requirement: Delete Friend Group with Confirmation
The system SHALL allow users to delete a friend group only from its detail view, and MUST require explicit confirmation before performing the deletion to prevent accidental data loss.

#### Scenario: Initiating group deletion
- **GIVEN** a user is viewing a friend group's detail page
- **WHEN** they click the "Delete Group" action
- **THEN** a modal confirmation dialog is displayed warning the user about the destructive action.

#### Scenario: Confirming group deletion
- **GIVEN** the deletion confirmation dialog is open
- **WHEN** the user clicks the "Confirm" button
- **THEN** the group is permanently removed from storage
- **AND** the user is redirected back to the main "Friend Groups" list (`/friends`)
- **AND** the characters themselves are NOT deleted from the global catalog.

#### Scenario: Canceling group deletion
- **GIVEN** the deletion confirmation dialog is open
- **WHEN** the user clicks the "Cancel" button
- **THEN** the dialog closes
- **AND** the group remains intact.
