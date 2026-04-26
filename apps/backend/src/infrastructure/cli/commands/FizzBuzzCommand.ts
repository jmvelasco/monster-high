import { RunFizzBuzzUseCase } from '../../../application/RunFizzBuzzUseCase';
import { Command } from '../Command';

export class FizzBuzzCommand implements Command {
  readonly name = 'fizzbuzz';
  readonly description = 'Run FizzBuzz for a given range';

  readonly parameters = {
    positionals: {
      min: { type: 'number' as const, description: 'Start of range' },
      max: { type: 'number' as const, description: 'End of range' },
    },
  };

  constructor(private readonly useCase: RunFizzBuzzUseCase) {}

  async execute(args: Record<string, unknown>): Promise<void> {
    const min = args.min as number | undefined;
    const max = args.max as number | undefined;

    if (min !== undefined && max !== undefined) {
      this.useCase.execute(min, max);
      return;
    }

    if (min !== undefined) {
      this.useCase.execute(0, min);
      return;
    }

    this.useCase.execute();
  }
}
