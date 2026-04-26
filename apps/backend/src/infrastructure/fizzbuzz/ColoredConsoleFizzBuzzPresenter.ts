import { FizzBuzzResult, FizzBuzzResultType } from '../../domain/FizzBuzz';
import { FizzBuzzPresenter } from '../../domain/FizzBuzzPresenter';

const ansiColors: Record<FizzBuzzResultType, string> = {
  even: '\x1b[33m',
  odd: '\x1b[32m',
  fizz: '\x1b[36m',
  buzz: '\x1b[35m',
  fizzbuzz: '\x1b[91m',
};

const resetColor = '\x1b[0m';

export class ColoredConsoleFizzBuzzPresenter implements FizzBuzzPresenter {
  present(results: FizzBuzzResult[]): void {
    const output = results.map((result) => `${ansiColors[result.type]}${result.value}${resetColor}`).join(' ');
    console.log(output);
  }
}
