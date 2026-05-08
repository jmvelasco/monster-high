import { FizzBuzzResult } from '../entities/FizzBuzz';

export interface FizzBuzzPresenter {
  present(results: FizzBuzzResult[]): void;
}
