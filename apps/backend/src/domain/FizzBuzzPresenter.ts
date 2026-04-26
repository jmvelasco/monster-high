import { FizzBuzzResult } from './FizzBuzz';

export interface FizzBuzzPresenter {
  present(results: FizzBuzzResult[]): void;
}
