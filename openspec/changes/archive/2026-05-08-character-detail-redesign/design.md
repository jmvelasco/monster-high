# Design: Character Detail Redesign

## 1. Sticky Layout Architecture
Instead of a standard `1fr 1fr` grid where both columns scroll together, we will modify `CharacterDetail.module.css` to use a sticky layout on desktop (`>= 1024px`).
- **Left Column:** Contains the Image, Friend Thumbnails, and the `GroupSelector`. It will use `position: sticky; top: 2rem;` and a max-height to avoid overflowing the viewport if it gets too tall.
- **Right Column:** Contains the textual information and `globalStory`, which will dictate the natural page scroll.

## 2. Best Friends Thumbnails
Data source: `technicalInfo.mejoresAmigos` (comma-separated string).
- We will parse this string to get individual names.
- We will leverage SWR's cache (already used in `useCharacter`) via a new or modified hook to access the full `characters.json` array without an extra network request.
- We will map the names to their respective character objects to extract the `image`.
- If an image is not found, a generic placeholder or textual avatar will be used.

## 3. GroupSelector Color Semantics
We will update `GroupSelector.module.css`:
- **Available Groups:** Background `--mh-light-gray`, Text `--mh-gray`.
- **Selected Groups (`.inGroup`):** Background `--mh-pink`, Text `white`.
- **Creation Form:** Input border `--mh-purple`, Submit button background `--mh-purple`.
