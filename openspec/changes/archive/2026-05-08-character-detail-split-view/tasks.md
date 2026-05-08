## 1. CSS Layout Refactoring

- [x] 1.1 Update `CharacterDetail.module.css` to restrict the height of `.detailContent` on desktop (`>= 1024px`) using `calc(100vh - 100px)`.
- [x] 1.2 Update `.leftColumn` in `CharacterDetail.module.css` to remove `position: sticky` and add `overflow-y: auto`.
- [x] 1.3 Update `.infoContainer` in `CharacterDetail.module.css` to add `overflow-y: auto` and `height: 100%` on desktop.

## 2. Validation

- [x] 2.1 Verify the layout on desktop to ensure there is no page-level scroll and both columns scroll independently.
- [x] 2.2 Run `npm run validate && npm run format:fix` to ensure formatting and linting pass.
