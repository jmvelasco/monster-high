# Plan: Domain validation — character must have a non-empty friends list before being saved

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
