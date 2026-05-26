import { FizzBuzzCommand } from '../../../infrastructure/cli/commands/FizzBuzzCommand';
import { RunFizzBuzzUseCase } from '../../../application/RunFizzBuzzUseCase';
import { FizzBuzzPresenter } from '../../../domain/ports/FizzBuzzPresenter';
import { FizzBuzzResult } from '../../../domain/entities/FizzBuzz';

class SpyPresenter implements FizzBuzzPresenter {
  presentedResults: FizzBuzzResult[] = [];
  present(results: FizzBuzzResult[]): void {
    this.presentedResults = results;
  }
}

describe('The FizzBuzz Command', () => {
  it('executes the use case with specified range when both min and max are provided', async () => {
    const spyPresenter = new SpyPresenter();
    const useCase = new RunFizzBuzzUseCase(spyPresenter);
    const command = new FizzBuzzCommand(useCase);

    await command.execute({ min: 10, max: 12 });

    expect(spyPresenter.presentedResults).toEqual([
      { value: 'Buzz', type: 'buzz' },
      { value: '11', type: 'odd' },
      { value: 'Fizz', type: 'fizz' },
    ]);
  });

  it('executes the use case from zero to min when only min is provided', async () => {
    const spyPresenter = new SpyPresenter();
    const useCase = new RunFizzBuzzUseCase(spyPresenter);
    const command = new FizzBuzzCommand(useCase);

    await command.execute({ min: 3 });

    expect(spyPresenter.presentedResults).toEqual([
      { value: 'FizzBuzz', type: 'fizzbuzz' },
      { value: '1', type: 'odd' },
      { value: '2', type: 'even' },
      { value: 'Fizz', type: 'fizz' },
    ]);
  });

  it('executes the use case with default range when no parameters are provided', async () => {
    const spyPresenter = new SpyPresenter();
    const useCase = new RunFizzBuzzUseCase(spyPresenter);
    const command = new FizzBuzzCommand(useCase);

    await command.execute({});

    expect(spyPresenter.presentedResults.length).toBe(101); // 0 to 100
  });
});
