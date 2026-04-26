## Why

The current backend entry point (`index.ts`) is acting as a monolithic composition root that is heavily coupled with the `yargs` CLI library. It handles dependency instantiation, CLI configuration, and command execution logic in a single file. This violates the Single Responsibility Principle (SRP), makes the codebase harder to maintain, and complicates the addition of new commands.

## What Changes

- **Abstract CLI Logic**: Introduce a `CommandLineProcessor` in the infrastructure layer to encapsulate all `yargs`-specific configuration.
- **Command Pattern**: Implement a library-agnostic `Command` interface to define command metadata and execution logic.
- **Domain-Oriented Renaming**: Rename the generic `pipeline` command to `generate-characters` to better reflect its business purpose.
- **Decoupled Command Implementation**: Move command-specific logic and dependency wiring into dedicated classes (`GenerateCharactersCommand`, `FizzBuzzCommand`).
- **Minimal Entry Point**: Refactor `index.ts` to be a clean composition root that only initializes the `CommandLineProcessor` with the available commands.

## Capabilities

### New Capabilities
- `cli-orchestration`: Provides a structured and decoupled way to register and execute commands from the command line.

### Modified Capabilities
- None

## Impact

- `apps/backend/src/index.ts`: Drastic reduction in complexity and imports.
- `apps/backend/src/infrastructure/cli/`: New directory structure for CLI-related infrastructure.
- `yargs` usage: Centralized in a single adapter-like class.

## Non-goals

- Changing the business logic of existing commands.
- Implementing a full-blown dependency injection container (manual wiring in commands is sufficient for now).
- Replacing `yargs` with another library (the goal is decoupling, not replacement).
