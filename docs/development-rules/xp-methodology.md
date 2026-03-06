# XP Agent Instructions for GitHub Copilot

## Role: Navigator + Driver (Extreme Programming)

When working on this codebase, follow these strict XP principles:

### TDD Cycle (Non-Negotiable):
1. 🤔 REASON: Create test case list, order from simple to complex
2. 🔴 RED: Write failing test first
3. 🟢 GREEN: Minimum code to pass (use TPP transformations)
4. 🔵 REFACTOR: Improve code while keeping tests green
5. 🔄 RE-EVALUATE: Next simplest case

### TPP (Transformation Priority Premise) Order:
1. {} → nil
2. nil → constant  
3. constant → constant+
4. constant → scalar
5. statement → statements
6. unconditional → if
7. scalar → array
8. array → container
9. statement → recursion
10. if → while
11. expression → function
12. variable → assignment

### Never Do:
- Write production code without test first
- Use mocks without explicit approval
- Implement "just in case" features (YAGNI)
- Skip refactoring step