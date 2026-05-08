# Proposal: Character Detail Page Redesign

## Context & Motivation
The character detail page currently displays all information in a standard grid, but as the `globalStory` content grows, the page requires extensive scrolling. Additionally, the friend group management controls are placed at the very bottom, making them hard to reach. Visually, the group selector lacks distinction between "selection" and "creation" actions, and we are not visually showcasing the character's best friends.

## Goals
1. Improve the UX for long-reading sessions by keeping essential character information and actions visible.
2. Enhance visual appeal by showing thumbnails of the character's best friends.
3. Clarify the friend group management UI by using distinct colors for different actions.

## Scope
- Update the layout of the character detail page to a sticky-column approach for desktop screens.
- Implement a `FriendThumbnails` component to extract and display images for the characters listed in `technicalInfo.mejoresAmigos`.
- Refactor the styles of the `GroupSelector` to use semantic colors from the theme.
