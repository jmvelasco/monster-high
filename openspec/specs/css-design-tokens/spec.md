## ADDED Requirements

### Requirement: All referenced CSS variables are defined
Every CSS custom property referenced in any `.css` or `.module.css` file SHALL have a definition in `global.css` `:root`.

#### Scenario: Variables that were previously undefined are now defined
- **WHEN** the app renders any component that uses `--mh-white`, `--shadow-md`, `--shadow-lg`, or `--spacing-5`
- **THEN** the variable resolves to a concrete value and the style applies visually

#### Scenario: No variable with inline fallback needed for defined tokens
- **WHEN** `--danger-color` and `--danger-color-hover` are defined in `:root`
- **THEN** components using these variables MAY remove inline fallback values

### Requirement: No unused variables in the token system
The `:root` block SHALL NOT contain variables that are never consumed by any component.

#### Scenario: Dead aliases are removed
- **WHEN** inspecting `global.css` `:root` after the change
- **THEN** `--font-heading`, `--font-body`, `--bg-color`, `--accent-color`, and `--border-color` SHALL NOT exist

### Requirement: Consistent variable naming
Each semantic concept SHALL have exactly one variable name across the system.

#### Scenario: Secondary text color unification
- **WHEN** any component needs a secondary text color
- **THEN** it SHALL use `--text-color-secondary` (not `--text-secondary-color`)

### Requirement: Components use design tokens over hardcoded values
Components SHALL use CSS custom properties for spacing, radii, font sizes, and transitions instead of literal values.

#### Scenario: FriendGroupDetailPage uses tokens
- **WHEN** inspecting `FriendGroupDetailPage.module.css`
- **THEN** all spacing values use `var(--spacing-*)`, all radii use `var(--radius-*)`, all font sizes use `var(--text-*)`, and all transitions use `var(--transition-*)`

#### Scenario: ConfirmDialog uses tokens
- **WHEN** inspecting `ConfirmDialog.module.css`
- **THEN** all spacing values use `var(--spacing-*)`, all radii use `var(--radius-*)`, all font sizes use `var(--text-*)`, and all transitions use `var(--transition-*)`

### Requirement: Font declarations include display strategy
All `@font-face` declarations SHALL include `font-display: swap`.

#### Scenario: Local fonts have font-display
- **WHEN** inspecting `fonts.css`
- **THEN** both `Learning Curve` and `Nesting` font-face rules include `font-display: swap`

### Requirement: No dead code files
Files that are not imported or referenced by any part of the application SHALL be removed.

#### Scenario: App.css removal
- **WHEN** searching for imports of `App.css` in the codebase
- **THEN** the file does not exist and no import references it

#### Scenario: Gruenewald VA removal
- **WHEN** looking for the `fonts/gruenewald-va/` directory
- **THEN** it does not exist

#### Scenario: ADR docs removal
- **WHEN** looking for the `docs/adr/` directory
- **THEN** it does not exist
