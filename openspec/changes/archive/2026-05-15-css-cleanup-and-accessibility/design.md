## Context

The web app uses CSS custom properties (design tokens) defined in `global.css` for spacing, colors, typography, radii, and transitions. However, several components reference variables that were never defined, some defined variables are never consumed, and two component files bypass the token system entirely with hardcoded values. Additionally, the `<dialog>` element's native centering is broken by the global `* { margin: 0 }` reset, and form inputs lack standard HTML form semantics preventing keyboard submission.

## Goals / Non-Goals

**Goals:**
- Complete the design token system (no undefined references, no dead tokens)
- Fix visual bugs caused by undefined variables (missing shadows, transparent backgrounds)
- Fix ConfirmDialog positioning
- Make form inputs keyboard-operable via standard `<form>` semantics
- Meet WCAG AA for keyboard navigation and screen reader basics
- Remove dead files that add no value

**Non-Goals:**
- Visual redesign or theme changes
- Font replacement
- Full WCAG AAA compliance
- E2E test coverage for accessibility
- Refactoring component architecture or state management

## Decisions

### 1. Fix dialog centering with `margin: auto` only

**Decision**: Add `margin: auto` to `.dialog` CSS class rather than changing the global reset.

**Alternatives considered**:
- Change global reset to exclude `dialog` elements → risks unintended side effects on other elements
- Add `position: fixed; inset: 0; margin: auto` (fully explicit) → redundant since `showModal()` already applies `position: fixed; inset: 0` via UA styles

**Rationale**: Minimal change. The UA stylesheet already handles positioning; we only need to restore the margin the reset stripped.

### 2. Wrap inputs in native `<form>` rather than adding `onKeyDown` handlers

**Decision**: Use `<form onSubmit={handler}>` wrapping input + button.

**Alternatives considered**:
- Add `onKeyDown` to detect Enter on each input → imperative, error-prone, doesn't respect form validation
- Use a `useFormSubmit` hook → over-engineering for a single input+button

**Rationale**: Native HTML form semantics give Enter-to-submit free, work with assistive tech, and follow platform conventions.

### 3. Remove dead aliases rather than migrating components to use them

**Decision**: Delete `--font-heading`, `--font-body`, `--bg-color`, `--accent-color`, `--border-color` from `:root`.

**Alternatives considered**:
- Keep aliases and migrate all components to consume them → larger change scope, touches many files, risk of regressions

**Rationale**: YAGNI. These aliases add indirection with no consumer. If a theming layer is needed later, it can be introduced with clear purpose.

### 4. Rename `--text-secondary-color` to `--text-color-secondary` (consumers win)

**Decision**: Update the variable name in `:root` to match what components already use.

**Rationale**: Three components reference `--text-color-secondary` with fallbacks. Only `:root` uses the other name. Changing the definition is one edit; changing all consumers would be three+ edits.

### 5. Dead code deletion without archival

**Decision**: Delete `App.css`, `fonts/gruenewald-va/`, and `docs/adr/` directly.

**Rationale**: All are tracked in git history. No value in keeping files that are unused and misleading.

### 6. Hardcoded migration scope limited to FriendGroupDetailPage and ConfirmDialog

**Decision**: Only migrate the two files identified in the audit. Don't sweep the entire codebase.

**Rationale**: These are the only files with systematic hardcoding. Other files already use tokens consistently.

## Risks / Trade-offs

- **[Removing aliases may need re-adding later]** → Low risk. Git history preserves them; re-adding is trivial if theming becomes a requirement.
- **[Adding `<form>` may cause unwanted page reload]** → Mitigated by `event.preventDefault()` in onSubmit handler.
- **[`margin: auto` may not center in older browsers without explicit positioning]** → All supported browsers (Chrome 90+, Firefox 90+, Safari 15+) support native `<dialog>` centering. Not a real risk for this project.
- **[Skip link visible on focus may surprise users]** → Standard pattern, visually hidden until focused. Users who see it are keyboard users who need it.
