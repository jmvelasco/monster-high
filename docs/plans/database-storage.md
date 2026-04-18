# Plan: Database Storage for Characters

## Goal

Replace `JsonRepository` with PostgreSQL as the **source of truth** for `Character` persistence in the backend pipeline.

The JSON file (`data/monsterHighCharacters.json`) continues to exist temporarily — the frontend still reads it from `public/api/`. That coupling disappears in a future phase when an API REST replaces the static JSON.

## Roadmap Context

This plan is **Phase 1** of three:

| Phase | Scope | Status |
|---|---|---|
| **1. DB persistence** | Pipeline writes to PostgreSQL. JSON remains as-is for the frontend. | **This plan** |
| 2. API REST | Backend exposes endpoints. Frontend fetches from API instead of static JSON. | Future |
| 3. Frontend hexagonal | Domain/infra separation in React. Meaningful once there's a real external dependency (HTTP). | Future |

---

## Current State

| Aspect | Detail |
|---|---|
| Domain port | `CharacterRepository` with a single method: `saveAll(characters: Character[]): Promise<void>` |
| Current adapter | `JsonRepository` writes all characters to a JSON file on disk |
| Use case | `GenerateCharacterCatalogUseCase` receives a `CharacterRepository` via constructor injection |
| Composition root | `index.ts` wires `JsonRepository` directly |
| Docker | None — no Dockerfile or docker-compose.yml exists |
| Character data shape | `name`, `url`, `technicalInfo` (key-value), `sections` (nested JSON), `image?`, `globalStory?` |

## Design Decisions

### PostgreSQL replaces JSON — not an alternative

The previous version of this plan treated JSON and Postgres as interchangeable adapters selected by `STORAGE_TYPE`. That was wrong:

- The JSON file serves two purposes: persistence **and** publication (the frontend reads it).
- The database only serves one: persistence.
- They are not interchangeable — they have different responsibilities.

In this plan:
- The use case writes to **PostgreSQL** via `PostgresCharacterRepository`.
- `JsonRepository` is **not touched**. It stays as-is. It will be reused or replaced in Phase 2 when the API REST eliminates the need for static JSON.
- The composition root (`index.ts`) wires `PostgresCharacterRepository` directly. No `STORAGE_TYPE` toggle.

### Port redesign: `save` replaces `saveAll`

The current port defines `saveAll(characters: Character[]): Promise<void>`. This was modeled after the JSON limitation — you rewrite the entire file each time.

With a database, persisting one record at a time is the natural operation. The port changes to:

```typescript
export interface CharacterRepository {
  save(character: Character): Promise<void>;
}
```

This also simplifies the use case — instead of accumulating an array and calling `saveAll` after each character, it calls `save` once per enriched character.

**Impact on `JsonRepository`:** must adapt to the new port signature. `save` appends/overwrites a single character in the JSON file. This is a behavioral change to `JsonRepository`, but it is driven by correcting the domain contract, not by the database work.

### No `findAll` / `findByName` yet

Adding read methods now would violate YAGNI — no consumer needs them until the API REST exists (Phase 2).

### `sections` excluded from database schema

`sections` is raw prose scraped from the wiki. Its only consumer is the AI story generator — once `globalStory` is produced, `sections` has served its purpose. The database stores only publishable data.

`technicalInfo` stays in the schema because the frontend displays it directly (age, pet, friends, etc.).

The `Character` domain entity is **not modified** — `sections` remains a field on the class. The Postgres adapter simply does not persist it. This avoids premature model changes; the question of whether to split the domain model (`Character` vs `PublishedCharacter`) is deferred to Phase 2 (see [Phase 2 Notes](#phase-2-notes-non-actionable)).

### Database choice: PostgreSQL

- `technicalInfo` maps naturally to a `JSONB` column.
- Well-supported driver ecosystem in Node.js.

### Client library: pg (node-postgres)

- Lightweight, no ORM overhead.
- Aligns with YAGNI — an ORM would add abstraction we don't need right now.
- The `pg` package has TypeScript types available via `@types/pg`.

### Schema design

Single `characters` table:

```sql
CREATE TABLE IF NOT EXISTS characters (
  name           TEXT PRIMARY KEY,
  url            TEXT NOT NULL,
  technical_info JSONB NOT NULL DEFAULT '{}',
  image          TEXT,
  global_story   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- `name` as PK because the domain uses it as the unique identifier (character names are unique in the Monster High wiki).
- `technical_info` stored as JSONB to preserve the domain structure without forced normalization.
- **No `sections` column** — raw scraped prose is intermediate data, not publishable.
- `created_at` / `updated_at` for basic operational observability.

### Testing strategy: `pg-mem` instead of Docker

Tests for `PostgresCharacterRepository` use **`pg-mem`** — an in-memory PostgreSQL emulator for Node.js. It supports the SQL subset we need (INSERT, UPSERT, SELECT, JSONB) without requiring Docker.

| Aspect | `pg-mem` | Docker real |
|---|---|---|
| Covers SQL correctness | Yes (wide subset) | Yes (full) |
| Requires running container | No | Yes |
| Speed | Fast (~ms) | Slow (~seconds) |
| Deterministic | Yes | Yes |
| CI complexity | None | Needs service setup |

Docker-based smoke tests remain an option for CI but are **not part of the TDD cycle**.

---

## Infrastructure: Docker Setup

### Files to create

| File | Purpose |
|---|---|
| `docker-compose.yml` (project root) | PostgreSQL container for **runtime** (not required for tests) |
| `.env.example` | Document all required environment variables |

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: monster-high-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: monster
      POSTGRES_PASSWORD: highschool
      POSTGRES_DB: monster_high
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Environment variables (added to config)

```
DATABASE_URL=postgresql://monster:highschool@localhost:5432/monster_high
```

---

## Implementation Cycles (TDD)

Each cycle follows REASON → RED → GREEN → REFACTOR → RE-EVALUATE.

---

### Cycle 0: Docker and project setup

**REASON:** We need the `pg` and `pg-mem` dependencies available and a Docker Compose file for runtime before writing any adapter code.

**Steps:**
1. Create `docker-compose.yml` at the project root.
2. Add `.env.example` documenting `DATABASE_URL`.
3. Install `pg`, `@types/pg` and `pg-mem` in `apps/backend`.
4. Add `database.url` to `config.ts`.

**No TDD cycle here** — this is infrastructure scaffolding with no behavioral code.

---

### Cycle 1: Change port from `saveAll` to `save`

**REASON:** The port is modeled after JSON's limitation (rewrite entire file). With a database, the natural contract is persisting one character at a time. This must happen before building the Postgres adapter so it implements the correct contract from the start.

**RED:** Update the existing `JsonRepository` tests — change calls from `saveAll([character])` to `save(character)`. Tests fail because `save` does not exist on the port or the implementation.

**GREEN:** Change the `CharacterRepository` interface from `saveAll(characters: Character[]): Promise<void>` to `save(character: Character): Promise<void>`. Update `JsonRepository` to implement `save` — read the current file (if it exists), append or replace the character by name, and write the file back. Update the use case to call `save(enriched)` instead of accumulating an array.

**REFACTOR:** Remove the `publishedCharacters` array accumulation from the use case if it becomes dead code.

**RE-EVALUATE:** All existing tests pass with the new port. The pipeline behavior is unchanged — characters are still persisted one by one (they already were, just less efficiently).

---

### Cycle 2: `PostgresCharacterRepository.save` — basic insert

**REASON:** This is the core deliverable — persisting a single character in PostgreSQL.

**RED:** Write a test using `pg-mem` for `PostgresCharacterRepository.save()`. The test creates a repository (backed by the in-memory PG), calls `save` with a test character, then queries the in-memory DB to assert the row exists. Fails because the class does not exist.

**GREEN:** Create `PostgresCharacterRepository` implementing `CharacterRepository`. In `save`, use `INSERT ... ON CONFLICT (name) DO UPDATE` (upsert). Include `CREATE TABLE IF NOT EXISTS` for auto-schema creation. Wire the `pg-mem` provided pool in tests via constructor injection.

**REFACTOR:** Extract SQL constants if clarity improves.

**RE-EVALUATE:** `save` inserts a row correctly in the in-memory DB.

---

### Cycle 3: `save` preserves all persisted fields

**REASON:** Cycle 2 may use minimal test data. This cycle ensures `technicalInfo` (JSONB), `image`, and `globalStory` are correctly stored. `sections` must NOT be persisted.

**RED:** Write a test that saves a `Character` with all fields populated (including nested `technicalInfo`, `sections`, `image`, `globalStory`). Assert via DB query that `technical_info` JSONB, `image`, and `global_story` are correct, and that no `sections` column exists.

**GREEN:** Fix the mapping if needed — ensure JSONB serialization and all nullable fields are handled.

**REFACTOR:** Extract a character-to-row mapping helper if the insert logic is getting dense.

**RE-EVALUATE:** Full publishable `Character` data survives the write path. `sections` is excluded.

---

### Cycle 4: `save` upserts on conflict

**REASON:** The pipeline may re-process characters. A character already in the DB must be updated, not cause errors.

**RED:** Write a test that calls `save` twice with the same character name but different data (e.g., changed `globalStory`). Assert the DB contains one row with the updated data and that `updated_at` changed.

**GREEN:** Ensure the `ON CONFLICT (name) DO UPDATE SET ...` clause updates all relevant columns including `updated_at`.

**REFACTOR:** Clean up the upsert SQL for readability.

**RE-EVALUATE:** Idempotent writes confirmed.

---

### Cycle 5: Connection lifecycle — disconnect

**REASON:** The `pg.Pool` must be closed after the pipeline finishes to avoid hanging Node.js processes.

**RED:** Write a test that creates a `PostgresCharacterRepository`, calls `disconnect()`, and verifies the pool is ended. Fails because the method doesn't exist.

**GREEN:** Add `disconnect(): Promise<void>` to the Postgres adapter (not to the port — this is infrastructure-specific).

**REFACTOR:** Evaluate if pool creation belongs in the constructor or should be injected. Keep it simple.

**RE-EVALUATE:** The pool is cleanable. No leaked connections.

---

### Cycle 6: Composition root — wire PostgreSQL adapter

**REASON:** The use case must use the Postgres adapter in the real pipeline.

**RED:** Write a test for the config module that asserts `config.database.url` reads from `DATABASE_URL` env var.

**GREEN:** Add `database.url` to `config.ts`. Update `index.ts` to create `PostgresCharacterRepository` and wire it into the use case. Call `disconnect()` after the pipeline completes.

**REFACTOR:** If the wiring in `index.ts` grows, extract a factory function.

**RE-EVALUATE:** Running the pipeline writes to PostgreSQL. The JSON file is no longer written by the pipeline. The existing JSON in `data/` and `public/api/` remains untouched for the frontend.

---

## File Change Summary

| File | Action | Description |
|---|---|---|
| `docker-compose.yml` | **Create** | PostgreSQL service definition |
| `.env.example` | **Create** | Document `DATABASE_URL` and existing env vars |
| `apps/backend/package.json` | **Edit** | Add `pg`, `@types/pg`, `pg-mem` |
| `apps/backend/src/config/config.ts` | **Edit** | Add `database.url` |
| `apps/backend/src/domain/CharacterRepository.ts` | **Edit** | Change `saveAll` to `save` |
| `apps/backend/src/infrastructure/storage/JsonRepository.ts` | **Edit** | Implement `save` (replaces `saveAll`) |
| `apps/backend/src/infrastructure/storage/PostgresCharacterRepository.ts` | **Create** | New adapter implementing `CharacterRepository` with pg |
| `apps/backend/src/application/GenerateCharacterCatalogUseCase.ts` | **Edit** | Call `save` instead of `saveAll` |
| `apps/backend/src/index.ts` | **Edit** | Wire `PostgresCharacterRepository`, call `disconnect()` |
| `apps/backend/src/__tests__/infrastructure/storage/JsonRepository.test.ts` | **Edit** | Adapt tests to `save` signature |
| `apps/backend/src/__tests__/infrastructure/storage/PostgresCharacterRepository.test.ts` | **Create** | Tests using `pg-mem` |

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `pg-mem` doesn't cover a Postgres-specific quirk | Add optional Docker-based smoke test in CI. |
| Character name collisions in PK | Names are scraped from the wiki where they are unique. The upsert handles duplicates safely. |
| Connection pool leak | Explicit `disconnect()` call in composition root + pool idle timeout configuration. |
| Frontend loses data source when pipeline stops writing JSON | The existing JSON files remain on disk. Frontend is unaffected until Phase 2 replaces static JSON with API. |
| `JsonRepository.save` is more complex than `saveAll` (read-modify-write) | Acceptable — it's a transitional adapter. Phase 2 may remove it entirely. |

## Out of Scope

- `findAll` / `findByName` on the port — needed in Phase 2 (API REST), not now.
- `STORAGE_TYPE` toggle — Postgres replaces JSON; they are not alternatives.
- Database migrations tool — not needed until the schema evolves beyond a single table.
- Connection pooling tuning — defaults are fine for this workload.
- ORM adoption — unnecessary complexity for one table.
- Frontend changes — the frontend continues reading static JSON until Phase 2.
- Domain model redesign (`Character` vs `PublishedCharacter`) — see Phase 2 notes below.

---

## Phase 2 Notes (Non-Actionable)

These are design considerations surfaced during Phase 1 planning. They are **not part of this implementation** — they exist to inform the next plan.

### Domain model: `sections` and the read path

In Phase 1, the `Character` entity keeps `sections` as a field. The Postgres adapter simply skips it when writing. This works because Phase 1 is write-only.

In Phase 2, the API REST will **read** characters from the database. At that point, `Character` instances reconstructed from DB rows will have no `sections`. This creates a question:

- **Option A: Make `sections` optional on `Character`.** Minimal change. Risk: the entity becomes ambiguous — you can't tell from the type whether sections were never scraped or just not loaded.
- **Option B: Split into two representations.** A `ScrapedCharacter` (full data, used during pipeline) and a `PublishedCharacter` (what the DB stores and the API returns). Cleaner type contracts, but more types to maintain.
- **Option C: Treat `sections` as a transient property.** Keep it on `Character` but document that it is not persisted and may be empty after reconstruction from DB. Pragmatic, least disruptive.

**No decision needed now.** When Phase 2 starts, the read path will force the issue and the right answer will be concrete, not speculative.

### API REST: read operations on the port

Phase 2 will extend `CharacterRepository` with read methods:

```typescript
export interface CharacterRepository {
  save(character: Character): Promise<void>;
  findAll(): Promise<Character[]>;
  findByName(name: string): Promise<Character | null>;
}
```

Both `PostgresCharacterRepository` and (if still alive) `JsonRepository` would implement them. The `findAll` / `findByName` tests deferred from Phase 1 will be written then.

### Save in two steps: scraping then story

The current pipeline discards a character entirely if story generation fails. An alternative is to persist the scraped data first (`save` after scraping, before AI), then update the record with the story. This changes the pipeline's failure semantics — partial data becomes acceptable.

This is a **product decision**, not a technical one. If partial persistence is desired, the use case changes to call `save` twice (once after scrape, once after story). The port and adapter don't change — `save` already upserts.

### `JsonRepository` lifecycle

Once the API REST exists and the frontend no longer reads static JSON, `JsonRepository` has no consumer. It can be:
- Deleted entirely.
- Repurposed as a `CatalogExporter` behind a different port (if JSON export remains useful for other consumers).
- Kept as a fallback (not recommended — adds maintenance cost with no value).
