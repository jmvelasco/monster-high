## Context

After Changes 1-4, the hexagonal architecture is in place for both vertical slices. This change handles the remaining shared components, accessibility improvements, and CSS alignment.

## Goals / Non-Goals

**Goals:**
- Move shared UI components to `shared/infrastructure/ui/`.
- Migrate `ConfirmDialog` to native `<dialog>`.
- Fix `useIsMobile` hook rule violation or replace it.
- Align CSS variable naming with skill conventions.
- Add `prefers-reduced-motion` media query.
- Fix typography issues (ellipsis, quotes).
- Clean up all empty legacy folders.

**Non-Goals:**
- Dark mode toggle UI.
- New features.
- i18n.

## Decisions

**Decision 1: `ConfirmDialog` uses native `<dialog>`**
- Use `dialog.showModal()` / `dialog.close()` via a ref.
- `::backdrop` for overlay styling (no custom overlay div).
- `overscroll-behavior: contain` on the dialog.
- Keyboard: `Escape` closes natively.
- Rationale: web-design-guidelines says "semantic HTML before ARIA".

**Decision 2: `useIsMobile` replaced by CSS media query**
- Components that need mobile behavior should use CSS `@media (max-width: 768px)` directly.
- If JS detection is truly needed, the `useEffect` + `addEventListener` stays in the **component** (not a hook), per frontend-patterns rules.
- Rationale: "useEffect lives in the component, not in hooks".

**Decision 3: CSS variable mapping**
- `--font-main-title` → `--font-heading`
- `--font-story` → stays (it's a specialty font, not body)
- `--font-ui` → `--font-body`
- `--mh-pink` → `--accent-color` (alias, keep `--mh-pink` too for specific theme identity)
- Add `--bg-color`, `--text-color`, `--text-secondary-color`, `--border-color` semantic aliases pointing to existing `--mh-*` values.

**Decision 4: `prefers-reduced-motion`**
- Add `@media (prefers-reduced-motion: reduce)` block in `global.css` that disables transitions globally.
- Individual component CSS can override if needed.

## Risks / Trade-offs

- [Risk] CSS variable renaming could break existing component styles.
  - *Mitigation*: Keep old variable names as aliases. Both old and new names work.
