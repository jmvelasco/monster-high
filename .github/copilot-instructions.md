# Context files to reference:

docs/development-rules/xp-methodology.md
docs/development-rules/coding-standards.md
docs/development-rules/testing-standards.md
docs/development-rules/tdd.md

# Rules:
Always use spanish to respond me
Always write test first (Red-Green-Refactor)
Always commit each step in the Red-Green-Refactor cycle. The commit message should be the test case description prepended with the TDD cycle step. For example: `test(red): <test case description>` for Red stage; `test(green): <test case description>` for Green stage. Optionally if a refactor is considered, also commit the changes done for the refactor applied related with the current TDD cycle.
Use TPP transformations for simplest implementation
No mocks without approval
YAGNI principle strictly
Refactor after each green test
Please help me follow TDD cycle starting with the failing test when I begin implementation.
If you add TODO notes in the test files to track the pending test cases ensure you update the status once it is validated