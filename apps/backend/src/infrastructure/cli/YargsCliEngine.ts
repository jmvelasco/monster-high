import yargs, { Argv } from 'yargs';
import { CLIEngine, CliParameterBuilder } from './CommandLineProcessor';

export class YargsCliEngine implements CLIEngine {
  private instance: Argv;

  constructor(args: string[]) {
    this.instance = yargs(args);
  }

  command(
    name: string,
    description: string,
    builder: (y: CliParameterBuilder) => CliParameterBuilder,
    handler: (args: Record<string, unknown>) => Promise<void>
  ): CLIEngine {
    this.instance = this.instance.command(name, description, this.adaptBuilder(builder), this.adaptHandler(handler));
    return this;
  }

  demandCommand(count: number, message: string): CLIEngine {
    this.instance = this.instance.demandCommand(count, message);
    return this;
  }

  strict(): CLIEngine {
    this.instance = this.instance.strict();
    return this;
  }

  help(): CLIEngine {
    this.instance = this.instance.help();
    return this;
  }

  async parseAsync(args?: string[]): Promise<unknown> {
    if (args) {
      return this.instance.parseAsync(args);
    }
    return this.instance.parseAsync();
  }

  private adaptBuilder(builder: (y: CliParameterBuilder) => CliParameterBuilder) {
    return (y: Argv): Argv => {
      builder(y as unknown as CliParameterBuilder);
      return y;
    };
  }

  private adaptHandler(handler: (args: Record<string, unknown>) => Promise<void>) {
    return async (args: { [key: string]: unknown }): Promise<void> => {
      await handler(args as Record<string, unknown>);
    };
  }
}
