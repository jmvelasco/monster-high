import yargs, { Argv } from 'yargs';
import { CLIEngine } from './CommandLineProcessor';

export class YargsCliEngine implements CLIEngine {
  private instance: Argv;

  constructor(args: string[]) {
    this.instance = yargs(args);
  }

  command(
    name: string,
    description: string,
    builder: (y: any) => any,
    handler: (args: any) => Promise<void>
  ): CLIEngine {
    this.instance = this.instance.command(name, description, builder, handler);
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

  async parseAsync(args?: string[]): Promise<any> {
    if (args) {
      return this.instance.parseAsync(args);
    }
    return this.instance.parseAsync();
  }
}
