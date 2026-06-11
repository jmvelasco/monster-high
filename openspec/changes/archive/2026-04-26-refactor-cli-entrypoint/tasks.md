## 1. Infrastructure Setup

- [x] 1.1 Create `Command` interface in `infrastructure/cli/Command.ts`
- [x] 1.2 Implement `CommandLineProcessor` in `infrastructure/cli/CommandLineProcessor.ts` to wrap `yargs`

## 2. Command Implementation

- [x] 2.1 Implement `FizzBuzzCommand` in `infrastructure/cli/commands/FizzBuzzCommand.ts` (moving logic from `index.ts`)
- [x] 2.2 Implement `GenerateCharactersCommand` in `infrastructure/cli/commands/GenerateCharactersCommand.ts` (moving logic from `index.ts`)
- [x] 2.3 Verify commands are decoupled from `yargs` metadata where possible

## 3. Entry Point Refactoring

- [x] 3.1 Refactor `apps/backend/src/index.ts` to initialize `CommandLineProcessor` with the new commands
- [x] 3.2 Remove all obsolete logic and imports from `index.ts`
- [x] 3.3 Verify CLI still works correctly with `fizzbuzz` and `generate-characters` commands

## 4. Testing (Inside-Out)

- [x] 4.1 Unit Test para `FizzBuzzCommand`: Verificar orquestación y mapeo de parámetros
- [x] 4.2 Unit Test para `GenerateCharactersCommand`: Verificar orquestación y captura de errores
- [x] 4.3 Unit Test para `CommandLineProcessor`: Verificar registro y delegación a comandos
