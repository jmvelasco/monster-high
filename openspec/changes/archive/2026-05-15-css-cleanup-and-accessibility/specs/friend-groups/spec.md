## MODIFIED Requirements

### Requirement: Group creation is keyboard accessible
The group creation flow SHALL allow users to submit via Enter key in addition to clicking the button.

#### Scenario: Enter key creates group in FriendGroupsPage
- **WHEN** user types "Mejores Amigas" in the group name input and presses Enter
- **THEN** a new group named "Mejores Amigas" is created and appears in the groups list

#### Scenario: Enter key creates group in GroupSelector
- **WHEN** user types a group name in the GroupSelector inline input and presses Enter
- **THEN** the group is created and the character is added to it

### Requirement: Group creation inputs are screen-reader accessible
Input fields for group creation SHALL be identifiable by screen readers.

#### Scenario: Input announces its purpose
- **WHEN** a screen reader user navigates to the group creation input
- **THEN** the screen reader announces the input's purpose via its accessible label
