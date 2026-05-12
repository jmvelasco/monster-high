import { Command } from '../../domain/ports/Command';

export interface CliParameterBuilder {
  option(name: string, config: { type: 'string' | 'number' | 'boolean'; description: string }): CliParameterBuilder;
  positional(name: string, config: { type: 'string' | 'number' | 'boolean'; description: string }): CliParameterBuilder;
}

export interface CLIEngine {
  command(
    name: string,
    description: string,
    builder: (y: CliParameterBuilder) => CliParameterBuilder,
    handler: (args: Record<string, unknown>) => Promise<void>
  ): CLIEngine;
  demandCommand(count: number, message: string): CLIEngine;
  strict(): CLIEngine;
  help(): CLIEngine;
  parseAsync(args?: string[]): Promise<unknown>;
}

export class CommandLineProcessor {
  constructor(
    private readonly commands: Command[],
    private readonly engine: CLIEngine
  ) {}

  async run(args?: string[]): Promise<void> {
    let cli = this.engine;

    this.commands.forEach((cmd) => {
      let commandName = cmd.name;
      if (cmd.parameters?.positionals) {
        const positionals = Object.keys(cmd.parameters.positionals)
          .map((p) => `[${p}]`)
          .join(' ');
        commandName = `${commandName} ${positionals}`.trim();
      }

      cli = cli.command(commandName, cmd.description, this.buildParameters(cmd), async (argv) => cmd.execute(argv));
    });

    await cli.demandCommand(1, 'Please specify a command').strict().help().parseAsync(args);
  }

  private buildParameters(cmd: Command) {
    return (y: CliParameterBuilder): CliParameterBuilder => {
      if (cmd.parameters?.options) {
        Object.entries(cmd.parameters.options).forEach(([name, config]) => {
          y.option(name, {
            type: config.type,
            description: config.description,
          });
        });
      }

      if (cmd.parameters?.positionals) {
        Object.entries(cmd.parameters.positionals).forEach(([name, config]) => {
          y.positional(name, {
            type: config.type,
            description: config.description,
          });
        });
      }

      return y;
    };
  }
}
