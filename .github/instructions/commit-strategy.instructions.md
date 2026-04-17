---
name: "Commit Strategy"
description: "Use when creating commits during TDD work in backend or frontend. Covers when to isolate red green refactor commits, how to name them, and when not to create extra commits."
applyTo: "apps/**/*.{ts,tsx,js,jsx}"
---

# Commit Strategy

- Use `test(red): ...`, `test(green): ...`, and `test(refactor): ...` when a commit represents a real TDD phase.
- A commit should capture one understandable unit of progress.
- RED commits should contain the new failing test and only the minimum compile scaffolding if needed.
- GREEN commits should contain only the minimum implementation required to pass the current test.
- REFACTOR commits should exist only when the refactor adds real value and is meaningfully separate from GREEN.
- Do not create separate commits for formatting, spacing, or trivial renames.
- Do not mix unrelated changes in one commit.
- Prefer behavior-oriented commit messages over implementation-detail messages.

## Good patterns

- `test(red): renders the character name`
- `test(green): renders the character name`
- `test(refactor): extract image logic to imageUtils`

## Avoid

- `test: add feature`
- `fix`
- merging RED and GREEN in one commit when they are distinct steps
- adding multiple new tests in one commit
