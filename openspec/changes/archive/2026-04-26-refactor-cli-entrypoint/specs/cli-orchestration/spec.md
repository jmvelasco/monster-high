## ADDED Requirements

### Requirement: Command registration and discovery
The system SHALL provide a mechanism to register decoupled command implementations into a central processor.

#### Scenario: Registering multiple commands
- **WHEN** the `CommandLineProcessor` is initialized with a list of commands
- **THEN** all commands MUST be available in the CLI help output

### Requirement: Command execution with parameters
The system SHALL execute the corresponding command when invoked from the terminal, passing any provided options or positional arguments.

#### Scenario: Executing generate-characters with options
- **WHEN** the user runs `bin/monster-high generate-characters --character "Draculaura"`
- **THEN** the `GenerateCharactersCommand` MUST be executed with the "character" parameter set to "Draculaura"

### Requirement: Library-agnostic command definition
The command implementations SHALL NOT depend on specific CLI libraries (like `yargs`) for their core execution logic or parameter definition.

#### Scenario: Command definition is decoupled
- **WHEN** inspecting a `Command` implementation
- **THEN** it MUST NOT import any CLI-specific libraries (like `yargs`) for its definition or execution logic
