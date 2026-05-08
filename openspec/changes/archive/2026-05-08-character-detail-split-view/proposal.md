## Why

The current sticky layout (Option A) for the Character Detail page creates a poor user experience. Because the left column (image, thumbnails, and group selector) can be taller than the viewport height, the `position: sticky` and `overflow-y: auto` combined with the natural page scroll causes a frustrating double scroll effect. We need to implement a Split View (Option B) layout to fix this.

## What Changes

- Refactor `CharacterDetail` layout on desktop to use a fixed viewport height (`100vh` minus header space).
- The left column will scroll independently if its content overflows.
- The right column (story) will also scroll independently.
- Remove page-level scrolling for the Character Detail page on desktop resolutions.

## Capabilities

### New Capabilities

None. This is purely a UI/UX layout refactoring.

### Modified Capabilities

- `character-detail`: Updating the layout requirements to enforce a split-view design on desktop to prevent double scrolling.

## Impact

- `CharacterDetail.tsx` component structure.
- `CharacterDetail.module.css` layout rules.
- Potential impact on the global page container or `Layout` component if we need to remove padding/margins to achieve full `100vh` sizing.

## Non-goals

- Modifying the visual design of the thumbnails or group selector colors.
- Altering the mobile layout (it should remain stacked).
