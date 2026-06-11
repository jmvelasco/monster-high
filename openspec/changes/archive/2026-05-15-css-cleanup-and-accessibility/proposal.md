## Why

The web app has accumulated CSS debt: undefined variables that silently break styles (no shadows, missing backgrounds), dead code (unused files and font assets), hardcoded values bypassing the design token system, and accessibility barriers that block keyboard and screen reader users. These issues degrade both the visual experience and usability for all users.

## What Changes

- Remove dead code: `App.css` (unused file), `fonts/gruenewald-va/` (font never integrated), `docs/adr/` (obsolete documentation)
- Define missing CSS variables (`--mh-white`, `--shadow-md`, `--shadow-lg`, `--spacing-5`) that are referenced but undefined
- Remove unused semantic aliases (`--font-heading`, `--font-body`, `--bg-color`, `--accent-color`, `--border-color`)
- Unify inconsistent variable naming (`--text-secondary-color` → `--text-color-secondary`)
- Centralize colors with inline fallbacks (`--danger-color`, `--danger-color-hover`) into `:root`
- Fix ConfirmDialog centering (broken by global CSS reset)
- Migrate hardcoded pixel values in FriendGroupDetailPage and ConfirmDialog to existing design tokens
- Add `font-display: swap` to local font declarations
- Wrap form inputs in `<form>` elements so Enter key submits (FriendGroupsPage, GroupSelector)
- Add `aria-label` to unlabeled inputs
- Add skip link for keyboard navigation
- Add `<h1>` to CharacterListPage
- Fix landmark confusion and decorative content in Header

## Capabilities

### New Capabilities

- `css-design-tokens`: Completes the design token system — defines missing variables, removes dead ones, unifies naming, and migrates hardcoded values to tokens
- `form-accessibility`: Ensures form inputs are keyboard-operable and screen-reader-labeled
- `navigation-accessibility`: Adds skip link, fixes heading hierarchy, corrects landmark roles

### Modified Capabilities

- `character-detail`: Dialog centering fix affects the ConfirmDialog used in character/group detail flows
- `friend-groups`: Form submission via Enter and aria-labels affect group creation and member management

## Impact

- **CSS**: `global.css` (variables), `fonts.css` (font-display), `ConfirmDialog.module.css`, `FriendGroupDetailPage.module.css` — token values and properties change
- **Components**: `FriendGroupsPage.tsx`, `GroupSelector.tsx` (form wrapping), `Layout.tsx` (skip link), `CharacterListPage.tsx` (h1), `Header.tsx` (landmarks/aria)
- **Deleted files**: `apps/web/src/App.css`, `fonts/gruenewald-va/`, `docs/adr/`
- **No API changes, no dependency changes, no breaking changes**

## Non-goals

- Changing colors or the visual theme
- Replacing fonts (Nesting, Learning Curve remain as-is)
- Adding dark mode or high-contrast support
- Refactoring component architecture
- Adding E2E tests
