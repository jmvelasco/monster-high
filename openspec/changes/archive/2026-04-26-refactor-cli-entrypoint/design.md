## Context

The backend application currently uses `yargs` directly in `index.ts`. This file has become a "God Object" that knows about every infrastructure detail and application use case just to wire them together for the CLI. 

## Goals / Non-Goals

**Goals:**
- Clean up `index.ts` to be a pure composition root.
- Decouple command definitions from the `yargs` library.
- Improve naming and semantics of CLI commands (e.g., `pipeline` -> `generate-characters`).
- Enable easier testing of command logic by isolating it from the CLI framework.

**Non-Goals:**
- Introducing an IoC container (dependency injection will remain manual but localized).
- Refactoring the core business logic of the use cases.

## Decisions

### 1. The `Command` Interface — Driving Port (CLI Entry)
`Command` is the **driving port** (primary port) through which CLI interactions enter the application. It lives in `domain/ports/` and defines the contract that every CLI command must implement.

```
interface CommandParameter {
  type: 'string' | 'number' | 'boolean';
  description: string;
}

interface Command {
  readonly name: string;
  readonly description: string;
  readonly parameters?: {
    options?: Record<string, CommandParameter>;
    positionals?: Record<string, CommandParameter>;
  };
  execute(args: Record<string, unknown>): Promise<void>;
}
```
*Rationale*: Using a declarative `parameters` property ensures total decoupling from the CLI library. The `Command` implementation only exposes data (what it needs), and the `CommandLineProcessor` handles the library-specific implementation (how to request it). This also eliminates the need for `any` or complex casting.

### 2. `CommandLineProcessor` — Driving Adapter
`CommandLineProcessor` is the **driving adapter** that translates the `yargs` CLI framework into the `Command` port. It lives in `infrastructure/cli/` and is the only place where the CLI library is imported.

```typescript
class CommandLineProcessor {
  constructor(private readonly commands: Command[]) {}
  run(): Promise<void> { ... }
}
```

This follows the hexagonal architecture of the backend:
- **Port** (`domain/ports/Command`) → defines what a CLI command looks like.
- **Adapter** (`infrastructure/cli/CommandLineProcessor`) → bridges `yargs` to the port.

### 3. Command-Level Composition Root
Each `Command` class will act as its own small composition root. It will import the necessary infrastructure and application classes it needs to run.

*Rationale*: Keeps `index.ts` clean and prevents the "Import Explosion" in the entry point.

## Risks / Trade-offs

- **[Risk]** → Manual wiring duplication: If multiple commands share many dependencies, there might be some repetition.
- **[Mitigation]** → Extract shared infrastructure factories if duplication becomes a problem (Rule of Three).
- **[Trade-off]** → Indirection: Adding a processor and command classes adds more files compared to a single `index.ts`.
- **[Benefit]** → Maintainability and Testability far outweigh the cost of a few extra files.
