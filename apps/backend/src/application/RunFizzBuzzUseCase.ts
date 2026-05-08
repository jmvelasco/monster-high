import { FizzBuzz } from '../domain/entities/FizzBuzz';
import { FizzBuzzPresenter } from '../domain/ports/FizzBuzzPresenter';

export class RunFizzBuzzUseCase {
  constructor(private readonly presenter: FizzBuzzPresenter) {}

  execute(min = 0, max = 100): void {
    const results = Array.from({ length: max - min + 1 }, (_, index) => FizzBuzz.convert(min + index));
    this.presenter.present(results);
  }
}
