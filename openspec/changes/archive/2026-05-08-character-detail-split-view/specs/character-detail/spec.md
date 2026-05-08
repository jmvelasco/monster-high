## ADDED Requirements

### Requirement: Split View Layout on Desktop
The system SHALL display the character details in a split-view layout on desktop screens (>= 1024px) to prevent double scrolling.

#### Scenario: Desktop view with long content
- **WHEN** a user views a character detail page on a screen wider than 1024px
- **THEN** the left column and right column should scroll independently
- **THEN** there should be no page-level scrollbar

#### Scenario: Mobile view
- **WHEN** a user views a character detail page on a screen narrower than 1024px
- **THEN** the layout should remain stacked and use the standard page-level scroll
