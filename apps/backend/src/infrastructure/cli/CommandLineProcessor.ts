import { Command } from './Command';

export interface CLIEngine {
  command(
    name: string,
    description: string,
    builder: (y: any) => any,
    handler: (args: any) => Promise<void>
  ): CLIEngine;
  demandCommand(count: number, message: string): CLIEngine;
  strict(): CLIEngine;
  help(): CLIEngine;
  parseAsync(args?: string[]): Promise<any>;
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

      cli = cli.command(
        commandName,
        cmd.description,
        (y) => {
          if (cmd.parameters?.options) {
            Object.entries(cmd.parameters.options).forEach(([name, config]) => {
              y.option(name, {
                type: config.type as any,
                description: config.description,
              });
            });
          }

          if (cmd.parameters?.positionals) {
            Object.entries(cmd.parameters.positionals).forEach(([name, config]) => {
              y.positional(name, {
                type: config.type as any,
                description: config.description,
              });
            });
          }

          return y;
        },
        async (argv) => {
          await cmd.execute(argv as Record<string, unknown>);
        }
      );
    });

    await cli.demandCommand(1, 'Please specify a command').strict().help().parseAsync(args);
  }
}
