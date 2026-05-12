## Pre-requisite

⚠️ **Changes 3 (hexagonal-characters-module) and 4 (hexagonal-friends-module) must be completed.**

## 1. Move Shared UI Components

📐 **Skill**: `frontend-patterns` → component file structure
🔧 **Refactor**: move + apply patterns

- [ ] 1.1 Move `Header` → `shared/infrastructure/ui/Header/Header.tsx` + `.module.css`. Apply patterns (no destructuring if applicable). Move test.
- [ ] 1.2 Move `Layout` → `shared/infrastructure/ui/Layout/Layout.tsx` + `.module.css`. Apply patterns. Move test.
- [ ] 1.3 Move `ConfirmDialog` → `shared/infrastructure/ui/ConfirmDialog/ConfirmDialog.tsx` + `.module.css`. Move test.
- [ ] 1.4 Update all imports across the codebase. Run `npx tsc --noEmit`.

## 2. Migrate ConfirmDialog to Native `<dialog>`

📐 **Skill**: `web-design-guidelines` → semantic HTML, accessibility
🔁 **TDD**: update ConfirmDialog tests

- [ ] 2.1 Refactor `ConfirmDialog` to use `<dialog>` element with `ref`, `showModal()`/`close()`. Remove custom overlay div, use `::backdrop`. Add `overscroll-behavior: contain`.
- [ ] 2.2 Update tests to verify native dialog behavior.

## 3. Remove `useIsMobile`

📐 **Skill**: `frontend-patterns` → no useEffect in hooks
🔧 **Refactor**

- [ ] 3.1 Find all usages of `useIsMobile`. Replace with CSS media queries or inline the `useEffect` + `useState` in the component that needs it. Delete `hooks/useIsMobile.ts`.

## 4. CSS Variables Alignment

📐 **Skill**: `frontend-patterns` → CSS Modules reference
🔧 **Refactor**

- [ ] 4.1 In `global.css`, add semantic aliases: `--font-heading: var(--font-main-title)`, `--font-body: var(--font-ui)`, `--bg-color: var(--mh-light-gray)`, `--text-color: var(--mh-gray)`, `--text-secondary-color`, `--border-color`, `--accent-color: var(--mh-pink)`.
- [ ] 4.2 Add `@media (prefers-reduced-motion: reduce)` block in `global.css` disabling transitions.

## 5. Typography Fixes

📐 **Skill**: `web-design-guidelines` → typography
🔧 **Refactor**

- [ ] 5.1 Replace `"Loading..."` with `"Cargando…"` (proper ellipsis `…`) across all components.
- [ ] 5.2 Replace straight quotes `"` with curly quotes `"` `"` in user-facing Spanish text.

## 6. Final Cleanup

🔧 **Housekeeping**

- [ ] 6.1 Delete all empty legacy folders: `hooks/` (if empty), `components/` (if empty), `pages/` (if empty), `types/` (if empty), `utils/` (if empty), `domain/` (if empty), `infrastructure/` (if empty at root level).
- [ ] 6.2 Verify final folder structure matches the hexagonal target from the exploration session.
- [ ] 6.3 Run `npx tsc --noEmit --project apps/web/tsconfig.json`.

## 7. Validation

- [ ] 7.1 Run `npm run validate --workspace=apps/web`. All tests pass.
- [ ] 7.2 Run `npm run format:fix`.
- [ ] 7.3 Manual smoke test: navigate all pages in browser, verify nothing is visually broken.
