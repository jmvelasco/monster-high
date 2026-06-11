## MODIFIED Requirements

### Requirement: ConfirmDialog displays centered on screen
The confirmation dialog SHALL appear centered both vertically and horizontally in the viewport when opened.

#### Scenario: Dialog opens centered
- **WHEN** a delete action triggers the ConfirmDialog to open
- **THEN** the dialog appears centered in the viewport regardless of scroll position or parent container

#### Scenario: Dialog remains centered after scroll
- **WHEN** the user has scrolled down the page and triggers the dialog
- **THEN** the dialog still appears centered in the visible viewport
