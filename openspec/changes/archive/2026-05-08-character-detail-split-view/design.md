## Context

In a previous iteration, we implemented a sticky left column for the Character Detail page (Option A). However, we discovered that if the left column content (image, thumbnails, and group selector) exceeds the viewport height, the browser's default behavior paired with `position: sticky` and page-level scroll creates a frustrating "double scroll" experience. The user wants to change this to a "Split View" (Option B).

## Goals / Non-Goals

**Goals:**
- Implement a Split View layout on desktop resolutions (`>= 1024px`) where the main page container is fixed to the viewport height.
- The left column (Image, Thumbnails, GroupSelector) and right column (Story) should scroll independently if their content overflows.
- Prevent page-level scrolling to eliminate the double scroll issue.

**Non-Goals:**
- Changes to the mobile layout (it remains a stacked, single-scroll layout).
- Visual redesign of individual components (just structural layout).

## Decisions

1. **Height Constraining:** We will limit `.detail` or a parent container to `calc(100vh - headerHeight - padding)`. Wait, since we can't easily know the exact header height in pure CSS without variables, we will use a reasonable `calc(100vh - 100px)` or update the global layout to pass a CSS variable. Alternatively, we can set `.detailContent` to `max-height: 100%` and `overflow: hidden`, and apply `overflow-y: auto` to both `.leftColumn` and `.infoContainer`.
2. **Independent Scrolling:** 
   - `.leftColumn` will have `overflow-y: auto` and no longer use `position: sticky`.
   - `.infoContainer` will also have `overflow-y: auto`.

## Risks / Trade-offs

- [Risk] Hardcoding `calc(100vh - 100px)` might be inaccurate on different devices or if the header height changes. → Mitigation: We will test the layout to ensure it fits reasonably or define a `--header-height` CSS variable if necessary.
- [Risk] Scrollbars in the middle of the screen might look unappealing on OSes that don't auto-hide scrollbars (like Windows). → Mitigation: We can use custom scrollbar CSS to make them slim and subtle.
