## 1. Increase token budget

- [x] 1.1 RED: Write test asserting `config.ai.maxTokens` equals 1024
- [x] 1.2 GREEN: Update `maxTokens` from 400 to 1024 in `apps/backend/src/config/config.ts`
- [x] 1.3 REFACTOR: Review config value — no refactor expected

## 2. Add closure instructions to system prompt

- [x] 2.1 RED: Write test asserting `buildPrompt` output contains a closure instruction (story MUST end with a complete closing sentence)
- [x] 2.2 RED: Write test asserting `buildPrompt` output contains a prioritization instruction (finish story over including every detail)
- [x] 2.3 GREEN: Update the prompt template in `GroqStoryGenerator.buildPrompt` to include closure and prioritization instructions
- [x] 2.4 REFACTOR: Review prompt readability and instruction ordering

## 3. Validate and format

- [x] 3.1 Run `npm run format:fix` on changed files
- [x] 3.2 Run full test suite to confirm no regressions
