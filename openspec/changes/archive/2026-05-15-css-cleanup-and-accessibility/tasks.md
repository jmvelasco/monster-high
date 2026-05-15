## 1. Dead Code Removal

- [x] 1.1 Delete `apps/web/src/App.css` (unused file, no imports reference it)
- [x] 1.2 Delete `fonts/gruenewald-va/` directory (font never integrated)
- [x] 1.3 Delete `docs/adr/` directory (obsolete documentation)
- [x] 1.4 Run `npm run validate` to confirm no breakage

## 2. CSS Design Tokens — Define Missing Variables

- [x] 2.1 Add `--mh-white: #ffffff` to `:root` in `global.css`
- [x] 2.2 Add `--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)` to `:root`
- [x] 2.3 Add `--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15)` to `:root`
- [x] 2.4 Add `--spacing-5: 1.25rem` to `:root`
- [x] 2.5 Add `--danger-color: #dc2626` and `--danger-color-hover: #b91c1c` to `:root`
- [x] 2.6 Rename `--text-secondary-color` to `--text-color-secondary` in `:root`

## 3. CSS Design Tokens — Remove Dead Variables

- [x] 3.1 Remove `--font-heading`, `--font-body`, `--bg-color`, `--accent-color`, `--border-color` from `:root`
- [x] 3.2 Run `npm run validate` to confirm no breakage

## 4. CSS Design Tokens — Font Display

- [x] 4.1 Add `font-display: swap` to both `@font-face` rules in `fonts.css`

## 5. ConfirmDialog Centering

- [x] 5.1 Add `margin: auto` to `.dialog` in `ConfirmDialog.module.css`

## 6. Migrate Hardcoded Values to Tokens

- [x] 6.1 Replace hardcoded spacing, radii, font-sizes, and transitions in `FriendGroupDetailPage.module.css` with design tokens
- [x] 6.2 Replace hardcoded spacing, radii, font-sizes, and transitions in `ConfirmDialog.module.css` with design tokens
- [x] 6.3 Remove inline fallbacks for `--danger-color` and `--danger-color-hover` now that they are defined in `:root`
- [x] 6.4 Run `npm run validate` to confirm no breakage

## 7. Form Accessibility — Enter Key Submission (TDD)

- [x] 7.1 🔴 RED: Write test that verifies pressing Enter in FriendGroupsPage input creates a group
- [x] 7.2 🟢 GREEN: Wrap input+button in `<form onSubmit>` in FriendGroupsPage
- [x] 7.3 🔴 RED: Write test that verifies pressing Enter in GroupSelector input creates a group
- [x] 7.4 🟢 GREEN: Wrap input+button in `<form onSubmit>` in GroupSelector
- [x] 7.5 🔵 REFACTOR: Ensure `event.preventDefault()` is called and no unwanted page navigation occurs

## 8. Form Accessibility — Aria Labels (TDD)

- [x] 8.1 🔴 RED: Write test that FriendGroupsPage input has accessible name
- [x] 8.2 🟢 GREEN: Add `aria-label` to FriendGroupsPage input
- [x] 8.3 🔴 RED: Write test that GroupSelector input has accessible name
- [x] 8.4 🟢 GREEN: Add `aria-label` to GroupSelector input

## 9. Navigation Accessibility — Skip Link (TDD)

- [x] 9.1 🔴 RED: Write test that Layout renders a skip link targeting main content
- [x] 9.2 🟢 GREEN: Add visually-hidden skip link in Layout.tsx + CSS in Layout.module.css
- [x] 9.3 Add `id` attribute to `<main>` element for skip link target

## 10. Navigation Accessibility — Heading Hierarchy (TDD)

- [x] 10.1 🔴 RED: Write test that CharacterListPage renders an `<h1>`
- [x] 10.2 🟢 GREEN: Add `<h1>` to CharacterListPage

## 11. Navigation Accessibility — Landmarks and Decorative Content

- [x] 11.1 Move `aria-label="Navegación principal"` from `<header>` to `<nav>` in Header.tsx
- [x] 11.2 Add `aria-hidden="true"` to the duplicate logo image in Header.tsx
- [x] 11.3 Wrap decorative emojis (💜, 👻) in `<span aria-hidden="true">` in Header, FriendGroupsPage, CharacterGrid
- [x] 11.4 Run `npm run validate` to confirm all tests pass after accessibility changes
