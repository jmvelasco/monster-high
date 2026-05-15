## ADDED Requirements

### Requirement: Form inputs submit on Enter key
Every text input paired with a submit button SHALL be wrapped in a `<form>` element with an `onSubmit` handler so that pressing Enter submits the form.

#### Scenario: Create group via Enter in FriendGroupsPage
- **WHEN** user types a group name in the create group input and presses Enter
- **THEN** the group is created (same behavior as clicking the create button)

#### Scenario: Create group via Enter in GroupSelector
- **WHEN** user types a group name in the GroupSelector input and presses Enter
- **THEN** the group is created (same behavior as clicking the create button)

#### Scenario: Empty input does not submit
- **WHEN** user presses Enter with an empty input
- **THEN** no group is created and no error is thrown

### Requirement: Form inputs have accessible labels
Every text input SHALL have a programmatic label accessible to screen readers, either via `<label>` element or `aria-label` attribute.

#### Scenario: FriendGroupsPage input is labeled
- **WHEN** a screen reader encounters the group name input in FriendGroupsPage
- **THEN** it announces the purpose of the input (e.g., "Nombre del grupo")

#### Scenario: GroupSelector input is labeled
- **WHEN** a screen reader encounters the group name input in GroupSelector
- **THEN** it announces the purpose of the input (e.g., "Nombre del nuevo grupo")
