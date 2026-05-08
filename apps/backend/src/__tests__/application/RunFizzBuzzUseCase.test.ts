import { RunFizzBuzzUseCase } from '../../application/RunFizzBuzzUseCase';
import { FizzBuzzResult } from '../../domain/FizzBuzz';
import { FizzBuzzPresenter } from '../../domain/FizzBuzzPresenter';

class InMemoryFizzBuzzPresenter implements FizzBuzzPresenter {
  public receivedResults: FizzBuzzResult[] = [];

  present(results: FizzBuzzResult[]): void {
    this.receivedResults = results;
  }
}

describe('The RunFizzBuzz Use Case', () => {
  it('generates fizzbuzz results for a given range and presents them', () => {
    const presenter = new InMemoryFizzBuzzPresenter();
    const useCase = new RunFizzBuzzUseCase(presenter);

    useCase.execute(1, 3);

    expect(presenter.receivedResults).toEqual([
      { value: '1', type: 'odd' },
      { value: '2', type: 'even' },
      { value: 'Fizz', type: 'fizz' },
    ]);
  });

  it('uses 0 to 100 as default range when no parameters provided', () => {
    const presenter = new InMemoryFizzBuzzPresenter();
    const useCase = new RunFizzBuzzUseCase(presenter);

    useCase.execute();

    expect(presenter.receivedResults).toHaveLength(101);
    expect(presenter.receivedResults[0]).toEqual({ value: 'FizzBuzz', type: 'fizzbuzz' });
    expect(presenter.receivedResults[100]).toEqual({ value: 'Buzz', type: 'buzz' });
  });
});
