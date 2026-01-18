---
name: monster-high-backend-hexagonal
description: Hexagonal Architecture guidelines for Monster High backend (TypeScript/Node.js). This skill should be used when writing, reviewing, or refactoring code in domain/, application/, or infrastructure/ layers. Enforces strict separation of concerns, dependency inversion, and SOLID principles. Triggers on tasks involving domain entities, use cases, ports, or adapters.
license: ISC
metadata:
  author: Monster High Project
  version: "1.0.0"
---

# Monster High Backend - Hexagonal Architecture

Hexagonal Architecture (Ports & Adapters) guidelines for the Monster High backend, designed for AI agents following XP methodology with strict TDD.

## When to Apply

Reference these guidelines when:
- Writing or modifying domain entities (`src/domain/`)
- Implementing use cases (`src/application/`)
- Creating infrastructure adapters (`src/infrastructure/`)
- Designing ports (interfaces for dependencies)
- Refactoring to improve layer separation

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         INFRASTRUCTURE                  │
│  (Adapters: HTTP, DB, External APIs)   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │       APPLICATION                 │ │
│  │    (Use Cases / Orchestration)    │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │       DOMAIN                │ │ │
│  │  │  (Entities, Business Logic) │ │ │
│  │  │   ZERO External Dependencies│ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Dependency Rule:** Dependencies point INWARD only.
- Infrastructure → Application → Domain ✅
- Domain → Application ❌ NEVER
- Domain → Infrastructure ❌ NEVER

---

## Rule Categories

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Domain Purity | CRITICAL |
| 2 | Ports Design | HIGH |
| 3 | Use Case Orchestration | HIGH |
| 4 | Adapter Implementation | MEDIUM |
| 5 | Dependency Injection | MEDIUM |

---

## 1. Domain Purity (CRITICAL)

### 1.1 Zero External Dependencies in Domain

**Impact: CRITICAL** — Domain must be framework-agnostic and testable in isolation.

**Rule:** Domain entities (`src/domain/`) must have ZERO imports from:
- Infrastructure (`axios`, `cheerio`, `groq-sdk`, `fs`, `dotenv`)
- Application layer
- Node.js built-ins (except `node:assert` for runtime validations)

**Incorrect:**
```typescript
// ❌ src/domain/Character.ts
import axios from 'axios';
import { config } from '../config/config';

export class Character {
  async fetchDetails() {
    const response = await axios.get(this.url); // ❌ HTTP call in domain
    return response.data;
  }
}
```

**Correct:**
```typescript
// ✅ src/domain/Character.ts
export class Character {
  private constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly technicalInfo: TechnicalInfo,
    public readonly sections: CharacterSections,
    public readonly image?: string,
    public readonly globalStory?: string
  ) {}

  static fromDetails(details: CharacterDetails): Character {
    return new Character(
      details.name,
      details.url,
      details.technicalInfo,
      details.sections,
      details.image
    );
  }

  withGlobalStory(story: string): Character {
    return new Character(
      this.name,
      this.url,
      this.technicalInfo,
      this.sections,
      this.image,
      story
    );
  }

  // ✅ Pure business logic, no external dependencies
  flattenForAIContext(): string {
    const technicalInfoText = Object.entries(this.technicalInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const sectionsText = Object.entries(this.sections)
      .map(([sectionName, section]) => {
        // ... formatting logic
      })
      .join('');

    return `CHARACTER: ${this.name}\n\n${technicalInfoText}\n\n${sectionsText}`;
  }
}
```

**Why:** Domain entities are the heart of the business. They must be:
- Testable without infrastructure setup (no database, HTTP, filesystem)
- Reusable in different contexts (CLI, web API, batch jobs)
- Framework-agnostic (can migrate from Node to Deno/Bun without changing domain)

---

### 1.2 Rich Domain Models (Not Anemic)

**Impact: HIGH** — Avoid data bags; put business logic in entities.

**Rule:** Domain entities should contain business behavior, not just data.

**Incorrect (Anemic Model):**
```typescript
// ❌ Character is just a data container
export interface Character {
  name: string;
  url: string;
  sections: CharacterSections;
}

// ❌ Business logic lives in services
export class CharacterService {
  flattenForAI(character: Character): string {
    // ... logic here
  }
}
```

**Correct (Rich Model):**
```typescript
// ✅ Character has behavior
export class Character {
  flattenForAIContext(): string {
    // Business logic lives here
  }

  withGlobalStory(story: string): Character {
    // Transformation logic lives here
  }
}
```

**Why:** Following "Tell, Don't Ask" and Law of Demeter. Data and behavior belong together.

---

## 2. Ports Design (HIGH)

### 2.1 Define Ports as Interfaces in Domain

**Impact: HIGH** — Domain defines "what it needs", infrastructure provides "how".

**Rule:** Ports (interfaces) live in `src/domain/` and define contracts that infrastructure implements.

**Correct:**
```typescript
// ✅ src/domain/CharacterScraper.ts
import { CharacterLink, Character } from './Character';

export interface CharacterScraper {
  scrapeCharacterLinks(): Promise<CharacterLink[]>;
  scrapeCharacterDetails(url: string): Promise<Character | null>;
}
```

```typescript
// ✅ src/domain/CharacterAI.ts
import { Character } from './Character';

export interface CharacterAI {
  generateGlobalStory(character: Character): Promise<string>;
}
```

**Why:** Dependency Inversion Principle (DIP). Domain defines interfaces, infrastructure adapts to them.

---

### 2.2 Port Naming Convention

**Impact: MEDIUM** — Consistent naming improves discoverability.

**Rule:** 
- Port interfaces: `CharacterScraper`, `CharacterRepository`, `CharacterAI`
- Implementation adapters: `WikiScraper`, `JsonRepository`, `AIService`

**Pattern:**
```
Domain Port (interface)  →  Infrastructure Adapter (implementation)
CharacterScraper        →  WikiScraper
CharacterRepository     →  JsonRepository
CharacterAI             →  AIService (Groq)
```

**Why:** Clear distinction between abstraction (port) and implementation (adapter).

---

## 3. Use Case Orchestration (HIGH)

### 3.1 Use Cases Coordinate, Don't Implement

**Impact: HIGH** — Use cases orchestrate domain entities and ports, don't contain business logic.

**Rule:** Use cases (`src/application/`) coordinate flow, delegate to domain entities and ports.

**Incorrect:**
```typescript
// ❌ Use case contains business logic
export class ScrapeAndProcessCharactersUseCase {
  async execute(): Promise<void> {
    const links = await this.scraper.scrapeCharacterLinks();

    for (const link of links) {
      const character = await this.scraper.scrapeCharacterDetails(link.url);
      
      // ❌ Business logic in use case
      const flattened = Object.entries(character.sections)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');
      
      const story = await this.ai.generateStory(flattened);
      // ...
    }
  }
}
```

**Correct:**
```typescript
// ✅ Use case orchestrates, domain has logic
export class ScrapeAndProcessCharactersUseCase {
  async execute(): Promise<void> {
    const links = await this.scraper.scrapeCharacterLinks();

    for (const link of links) {
      const character = await this.scraper.scrapeCharacterDetails(link.url);
      if (!character) continue;

      // ✅ Delegates to domain method
      const story = await this.ai.generateGlobalStory(character);

      // ✅ Delegates to domain method
      const enrichedCharacter = character.withGlobalStory(story);

      await this.repository.saveAll([enrichedCharacter]);
    }
  }
}
```

**Why:** Use cases are thin orchestration layers. Domain contains business logic.

---

### 3.2 Constructor Injection for Dependencies

**Impact: MEDIUM** — Explicit dependencies, testable without mocks.

**Rule:** Use cases receive dependencies via constructor.

**Correct:**
```typescript
export class ScrapeAndProcessCharactersUseCase {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly ai: CharacterAI,
    private readonly repository: CharacterRepository
  ) {}

  async execute(): Promise<void> {
    // Use dependencies
  }
}
```

**Why:** Explicit dependencies. Easy to test with test doubles (no mocks unless approved).

---

## 4. Adapter Implementation (MEDIUM)

### 4.1 Adapters Implement Domain Ports

**Impact: MEDIUM** — Adapters translate external world to domain contracts.

**Rule:** Infrastructure adapters (`src/infrastructure/`) implement domain port interfaces.

**Correct:**
```typescript
// ✅ src/infrastructure/scraper/WikiScraper.ts
import { CharacterScraper } from '../../domain/CharacterScraper';
import { Character, CharacterLink } from '../../domain/Character';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class WikiScraper implements CharacterScraper {
  async scrapeCharacterLinks(): Promise<CharacterLink[]> {
    const response = await axios.get(/* ... */);
    const $ = cheerio.load(response.data);
    // Parse HTML, return CharacterLink[]
  }

  async scrapeCharacterDetails(url: string): Promise<Character | null> {
    // Fetch, parse, return Character
  }
}
```

**Why:** Adapter pattern. External libraries (axios, cheerio) isolated in infrastructure.

---

### 4.2 No Business Logic in Adapters

**Impact: MEDIUM** — Adapters translate, don't decide.

**Rule:** Adapters perform I/O and data transformation, not business decisions.

**Incorrect:**
```typescript
// ❌ Adapter contains business logic
export class WikiScraper implements CharacterScraper {
  async scrapeCharacterDetails(url: string): Promise<Character | null> {
    const $ = cheerio.load(html);
    const name = $('.title').text();

    // ❌ Business rule: "if no image, use default"
    const image = $('.image').attr('src') || '/default-avatar.png';

    return Character.fromDetails({ name, image, /* ... */ });
  }
}
```

**Correct:**
```typescript
// ✅ Adapter extracts raw data
export class WikiScraper implements CharacterScraper {
  async scrapeCharacterDetails(url: string): Promise<Character | null> {
    const $ = cheerio.load(html);
    const name = $('.title').text();
    const image = $('.image').attr('src'); // ✅ No default logic

    return Character.fromDetails({ name, image, /* ... */ });
  }
}

// ✅ Domain decides default behavior
export class Character {
  getDisplayImage(): string {
    return this.image ?? '/default-avatar.png'; // Business rule in domain
  }
}
```

**Why:** Business rules belong in domain, not infrastructure.

---

## 5. Dependency Injection (MEDIUM)

### 5.1 Manual DI in Entry Point (No Framework)

**Impact: MEDIUM** — Explicit wiring, no magic.

**Rule:** Wire dependencies manually in `src/index.ts` (entry point). No DI frameworks.

**Correct:**
```typescript
// ✅ src/index.ts
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { AIService } from './infrastructure/ai/AIService';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { ScrapeAndProcessCharactersUseCase } from './application/ScrapeAndProcessCharactersUseCase';

async function main() {
  // Manual wiring (composition root)
  const scraper = new WikiScraper();
  const ai = new AIService();
  const repository = new JsonRepository();

  const useCase = new ScrapeAndProcessCharactersUseCase(scraper, ai, repository);

  await useCase.execute();
}

main().catch(console.error);
```

**Why:** YAGNI. No DI framework needed for small project. Clear dependency graph.

---

### 5.2 Test Doubles Over Mocks

**Impact: MEDIUM** — Prefer fake implementations, avoid mock libraries.

**Rule:** For testing, create fake implementations of ports. Use mocks only with approval.

**Correct:**
```typescript
// ✅ __tests__/fakes/FakeCharacterScraper.ts
export class FakeCharacterScraper implements CharacterScraper {
  private characters: Character[] = [];

  setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  async scrapeCharacterLinks(): Promise<CharacterLink[]> {
    return this.characters.map(c => ({ name: c.name, url: c.url }));
  }

  async scrapeCharacterDetails(url: string): Promise<Character | null> {
    return this.characters.find(c => c.url === url) || null;
  }
}
```

```typescript
// ✅ __tests__/application/ScrapeAndProcessCharactersUseCase.test.ts
test('processes characters successfully', async () => {
  const fakeScraper = new FakeCharacterScraper();
  const fakeAI = new FakeCharacterAI();
  const fakeRepository = new FakeCharacterRepository();

  fakeScraper.setCharacters([/* test data */]);

  const useCase = new ScrapeAndProcessCharactersUseCase(
    fakeScraper,
    fakeAI,
    fakeRepository
  );

  await useCase.execute();

  expect(fakeRepository.getSaved()).toHaveLength(1);
});
```

**Why:** Fakes are real implementations (no magic). Tests verify behavior, not implementation details.

---

## Summary Checklist

When working on Monster High backend code:

### Domain (`src/domain/`)
- [ ] Zero external dependencies (no axios, cheerio, fs, etc.)
- [ ] Rich models with business logic (not anemic data bags)
- [ ] Pure functions where possible
- [ ] Ports (interfaces) defined here

### Application (`src/application/`)
- [ ] Use cases orchestrate, don't implement logic
- [ ] Dependencies injected via constructor
- [ ] Delegate to domain methods for business rules

### Infrastructure (`src/infrastructure/`)
- [ ] Adapters implement domain ports
- [ ] External libraries isolated here (axios, cheerio, groq-sdk)
- [ ] No business logic, only I/O and translation
- [ ] Respect port contracts exactly

### Testing
- [ ] Fake implementations of ports (no mocks unless approved)
- [ ] Tests verify behavior, not implementation
- [ ] Domain tests require zero infrastructure setup

---

## References

- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports & Adapters Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
