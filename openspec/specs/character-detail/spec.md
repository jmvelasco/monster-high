# Specs: Character Detail

## Capability Overview
The Character Detail capability displays detailed information about a single character, including their profile, traits, and related content.

## User Scenarios

### Scenario 1: Split view layout on desktop
**Given** a user is viewing a character detail page on a screen wider than 768px
**When** the page renders with long content in both columns
**Then** the left column and right column should scroll independently
**And** there should be no page-level scrollbar.

#### Acceptance Criteria:
- Split-view layout activates at >= 768px viewport width.
- Each column scrolls independently to prevent double scrolling.
- No page-level scrollbar appears when content overflows.

### Scenario 2: Stacked layout on mobile
**Given** a user is viewing a character detail page on a screen narrower than 768px
**When** the page renders
**Then** the layout should remain stacked and use the standard page-level scroll.

#### Acceptance Criteria:
- Below 768px the layout falls back to a single-column stack.
- Standard page-level scrolling is used.

## Technical Constraints & Edge Cases
- **Breakpoint**: The desktop/mobile threshold is 768px.
- **Scroll Independence**: Each column must handle overflow independently to avoid nested scrollbar conflicts.
