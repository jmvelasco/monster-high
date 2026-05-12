## Why

After Changes 1-4, both vertical slices (characters, friends) follow hexagonal architecture, but shared UI components (`Header`, `Layout`, `ConfirmDialog`) still live in the legacy `components/` folder, `useIsMobile` violates hook rules, CSS variables don't align with the `frontend-patterns` skill naming, and several web-design-guidelines issues remain (no `<dialog>` native, no `prefers-reduced-motion`, straight quotes/ellipsis). This final change cleans up everything.

## What Changes

- Move `Header/`, `Layout/` → `shared/infrastructure/ui/` with proper folder structure.
- Migrate `ConfirmDialog` to native `<dialog>` element.
- Remove or rewrite `useIsMobile` (move `useEffect` to component, or replace with CSS media query).
- Align CSS variables with skill naming conventions.
- Add `prefers-reduced-motion` support.
- Fix typography: loading `…`, curly quotes.
- Delete empty legacy folders (`hooks/`, `components/`, `pages/`, etc.).
- Final test reorganization.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(none — UX polish only)_

## Impact

- **Moved files**: `Header`, `Layout`, `ConfirmDialog` + their CSS modules and tests.
- **Modified files**: `global.css` (variable renaming), various CSS modules (motion queries).
- **Deleted**: Empty legacy folders, `useIsMobile.ts`.

## Non-goals

- Adding new features or components.
- Dark mode implementation (CSS vars are prepared but theme switching is out of scope).
- Internationalization.

## Pre-requisites

- **Changes 3 and 4** must be completed (so `components/` and `pages/` are mostly empty).
