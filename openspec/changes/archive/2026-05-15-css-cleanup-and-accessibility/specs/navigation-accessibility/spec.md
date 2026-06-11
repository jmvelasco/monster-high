## ADDED Requirements

### Requirement: Skip link for keyboard navigation
The layout SHALL include a visually hidden link that becomes visible on focus, allowing keyboard users to skip directly to the main content area.

#### Scenario: Skip link appears on Tab
- **WHEN** a keyboard user presses Tab on page load
- **THEN** a "Ir al contenido" link becomes visible at the top of the viewport

#### Scenario: Skip link moves focus to main content
- **WHEN** user activates the skip link
- **THEN** focus moves to the `<main>` element, bypassing header and navigation

#### Scenario: Skip link is hidden for mouse users
- **WHEN** a mouse user views the page without focusing the skip link
- **THEN** the skip link is not visible

### Requirement: Every page has a valid heading hierarchy
Each page SHALL have exactly one `<h1>` element that describes the page content.

#### Scenario: CharacterListPage has h1
- **WHEN** rendering the character list page
- **THEN** a `<h1>` element is present describing the page (e.g., "Personajes")

### Requirement: Navigation landmarks are correctly labeled
The `<nav>` element SHALL carry the `aria-label` for the navigation landmark, not the `<header>`.

#### Scenario: Screen reader identifies navigation
- **WHEN** a screen reader encounters the header area
- **THEN** it identifies a `navigation` landmark labeled "Navegación principal" on the `<nav>` element

### Requirement: Decorative content is hidden from assistive tech
Emojis and decorative images that convey no information SHALL be hidden from screen readers via `aria-hidden="true"`.

#### Scenario: Decorative emojis are not announced
- **WHEN** a screen reader encounters emoji characters used as decoration (💜, 👻)
- **THEN** they are not announced

#### Scenario: Duplicate logo image is hidden
- **WHEN** two logo images exist for responsive display
- **THEN** only one has an accessible name; the other has `aria-hidden="true"`
