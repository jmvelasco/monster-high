# Plan: Auto-copy generated JSON to frontend public folder after catalog generation

## Scope
After `GenerateCharacterCatalogUseCase.execute()` completes successfully, copy the generated
`monsterHighCharacters.json` from the backend data directory to `apps/web/public/api/characters.json`
so the frontend can consume the freshest data immediately.

Architecture placement: exclusively `infrastructure/storage/` (new adapter `FileCopyPublisher`).
No domain port needed — this is a purely operational infrastructure concern.

---

## Step 1 — Config: add frontend public path

**File:** `apps/backend/src/config/config.ts`

Add `storage.frontendPublicPath` resolving to
`path.resolve(__dirname, '../../../../../apps/web/public/api/characters.json')`.
No test needed — config is a value object with no logic.

---

## Step 2 — `FileCopyPublisher` adapter: RED

**File:** `apps/backend/src/__tests__/infrastructure/storage/FileCopyPublisher.test.ts`

Write tests:
- `publish()` copies source file content to destination path.
- `publish()` creates destination directory if it does not exist.
- `publish()` throws a descriptive error when the source file does not exist.

TDD gate: run `npm run test --workspace=apps/backend` → all new cases must FAIL.

---

## Step 3 — `FileCopyPublisher` adapter: GREEN

**File:** `apps/backend/src/infrastructure/storage/FileCopyPublisher.ts`

Implement `FileCopyPublisher` with a `publish(): Promise<void>` method that:
1. Ensures destination directory exists (`fs.mkdir` with `recursive: true`).
2. Copies source to destination (`fs.copyFile`).

TDD gate: run `npm run test --workspace=apps/backend` → all Step 2 cases must PASS.

---

## Step 4 — `FileCopyPublisher` adapter: REFACTOR → RE-EVALUATE

Review `FileCopyPublisher` for clarity and duplication.
Confirm all Step 2 tests still pass.

---

## Step 5 — `GenerateCharactersCommand` integration: RED

**File:** `apps/backend/src/__tests__/infrastructure/cli/GenerateCharactersCommand.test.ts` (existing or new)

Add tests:
- `publisher.publish()` is called exactly once after a successful `useCase.execute()`.
- `publisher.publish()` is NOT called if `useCase.execute()` throws.

TDD gate: run `npm run test --workspace=apps/backend` → new cases must FAIL.

---

## Step 6 — `GenerateCharactersCommand` integration: GREEN

**File:** `apps/backend/src/infrastructure/cli/commands/GenerateCharactersCommand.ts`

Inject `FileCopyPublisher` (typed via an interface or directly) as a constructor dependency.
Call `await this.publisher.publish()` after `await this.useCase.execute(character)` inside the `try` block.

TDD gate: run `npm run test --workspace=apps/backend` → all Step 5 cases must PASS.

---

## Step 7 — Integration: REFACTOR → RE-EVALUATE

Confirm clean typing, no domain layer imports, all prior tests green.

---

## Step 8 — Wiring in composition root

**File:** `apps/backend/src/index.ts`

Instantiate `FileCopyPublisher` with paths from `config.storage` and inject into `GenerateCharactersCommand`.

---

## Step 9 — Final validation

Run `npm run validate` from repo root. Must pass 100%.

---

# [ARCHIVED] Plan: Domain validation — character must have a non-empty friends list before being saved

## Scope
Add a domain invariant to `Character` that expresses whether the character has a declared friends list.
Enforce that invariant in `GenerateCharacterCatalogUseCase` so that characters without friends are
skipped (never reach `CharacterRepository.saveAll`).

---

## Step 1 — Domain entity: RED

**File:** `apps/backend/src/__tests__/domain/Character.test.ts`

Add a `describe('hasFriends()')` block with the following test cases:

- Returns `false` when `technicalInfo.mejoresAmigos` is absent.
- Returns `false` when `technicalInfo.mejoresAmigos` is an empty string `""`.
- Returns `false` when `technicalInfo.mejoresAmigos` is a whitespace-only string `"  "`.
- Returns `true` when `technicalInfo.mejoresAmigos` contains a non-empty value like `"Draculaura, Clawdeen"`.

**TDD gate:** Run `npm run test --workspace=apps/backend` → all four new cases must FAIL (method does not exist yet).

---

## Step 2 — Domain entity: GREEN

**File:** `apps/backend/src/domain/entities/Character.ts`

Add a public method `hasFriends(): boolean` that returns `true` if and only if
`this.technicalInfo.mejoresAmigos` is a non-empty, non-whitespace string.

**TDD gate:** Run `npm run test --workspace=apps/backend` → the four new cases in Step 1 must now PASS.
All pre-existing tests must remain green.

---

## Step 3 — Domain entity: REFACTOR → RE-EVALUATE

Review `hasFriends()` for clarity and consistency with the existing `isEmpty()` style.
Re-run `npm run test --workspace=apps/backend` → full green.

---

## Step 4 — Application use case: RED

**File:** `apps/backend/src/__tests__/application/GenerateCharacterCatalogUseCase.test.ts`

Add a new `it(...)` test case:

> *"skips a character and does not save it when its friends list is empty"*

The test constructs two characters: one with `technicalInfo: { mejoresAmigos: 'Draculaura' }` and
one with `technicalInfo: {}` (no friends). It expects the repository to contain only the character
that has friends.

**TDD gate:** Run `npm run test --workspace=apps/backend` → new case must FAIL (use case does not yet filter by `hasFriends()`).

---

## Step 5 — Application use case: GREEN

**File:** `apps/backend/src/application/GenerateCharacterCatalogUseCase.ts`

In `execute()`, after the existing `character.isEmpty()` guard, add:

```
if (!enriched.hasFriends()) {
  this.logger.log(`⚠️ Skipping ${link.name} (No friends list).`);
  continue;
}
```

**TDD gate:** Run `npm run test --workspace=apps/backend` → the new case in Step 4 must PASS.
All pre-existing tests must remain green.

---

## Step 6 — Application use case: REFACTOR → RE-EVALUATE

Verify the guard reads naturally alongside the existing `isEmpty()` guard.
Run `npm run validate` (full monorepo) → must be fully green before marking this plan complete.
