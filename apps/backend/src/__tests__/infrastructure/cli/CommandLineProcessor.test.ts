import { Command } from '../../../domain/ports/Command';
import { CLIEngine, CliParameterBuilder, CommandLineProcessor } from '../../../infrastructure/cli/CommandLineProcessor';

class MockCommand implements Command {
  name = 'test-cmd';
  description = 'test desc';
  parameters = {
    options: {
      foo: { type: 'string' as const, description: 'foo desc' },
    },
  };
  executedArgs: Record<string, unknown> | null = null;
  async execute(args: Record<string, unknown>): Promise<void> {
    this.executedArgs = args;
  }
}

class MockCLIEngine implements CLIEngine {
  registeredHandlers: Record<string, (args: Record<string, unknown>) => Promise<void>> = {};

  command(
    name: string,
    description: string,
    builder: (y: CliParameterBuilder) => CliParameterBuilder,
    handler: (args: Record<string, unknown>) => Promise<void>
  ): CLIEngine {
    // Extract the command name (ignoring positionals for this mock)
    const baseName = name.split(' ')[0] || '';
    this.registeredHandlers[baseName] = handler;
    return this;
  }

  demandCommand(): CLIEngine {
    return this;
  }
  strict(): CLIEngine {
    return this;
  }
  help(): CLIEngine {
    return this;
  }

  async parseAsync(args: string[] = []): Promise<unknown> {
    const commandName = args[0] || '';
    const handler = this.registeredHandlers[commandName];
    if (handler) {
      // Very simple mock: just pass a mock args object
      // In a real scenario, we might want to actually parse the args
      await handler({ foo: 'bar' });
    }
    return {};
  }
}

describe('The CommandLineProcessor', () => {
  it('registers commands and delegates execution to the correct one', async () => {
    const mockCommand = new MockCommand();
    const mockEngine = new MockCLIEngine();
    const processor = new CommandLineProcessor([mockCommand], mockEngine);

    await processor.run(['test-cmd']);

    expect(mockCommand.executedArgs).toMatchObject({ foo: 'bar' });
  });
});
