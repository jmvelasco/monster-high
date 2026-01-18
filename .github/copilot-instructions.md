# Context files to reference:

## Core XP Methodology (Always)
docs/development-rules/xp-methodology.md
docs/development-rules/coding-standards.md
docs/development-rules/testing-standards.md
docs/development-rules/tdd.md

## Backend Development (when editing src/*)
.github/skills/backend-hexagonal/SKILL.md
- Hexagonal Architecture: Domain → Application → Infrastructure
- Domain MUST have zero external dependencies
- Ports (interfaces) in domain, adapters in infrastructure
- Use cases orchestrate, don't implement business logic

## Frontend Development (when editing apps/web/* - future)
.github/skills/react-best-practices/SKILL.md
- 45 rules across 8 categories (Waterfalls, Bundle, Server, Client, Re-render, Rendering, JS, Advanced)
- Apply performance optimizations ONLY when measured (YAGNI principle)
- TanStack Query for data fetching
- Accessibility-first approach

# Rules:
Always use spanish to respond me
Always write test first (Red-Green-Refactor)
Always commit each step in the Red-Green-Refactor cycle. The commit message should be the test case description prepended with the TDD cycle step. For example: `test(red): <test case description>` for Red stage; `test(green): <test case description>` for Green stage. Optionally if a refactor is considered, also commit the changes done for the refactor applied related with the current TDD cycle.
Use TPP transformations for simplest implementation
No mocks without approval
YAGNI principle strictly
Refactor after each green test
Performance optimization ONLY when measured as necessary (backend and frontend)
Please help me follow TDD cycle starting with the failing test when I begin implementation.
If you add TODO notes in the test files to track the pending test cases ensure you update the status once it is validated