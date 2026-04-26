export type FizzBuzzResultType = 'even' | 'odd' | 'fizz' | 'buzz' | 'fizzbuzz';

export interface FizzBuzzResult {
  value: string;
  type: FizzBuzzResultType;
}

export class FizzBuzz {
  static convert(number: number): FizzBuzzResult {
    if (number % 3 === 0 && number % 5 === 0) {
      return { value: 'FizzBuzz', type: 'fizzbuzz' };
    }
    if (number % 3 === 0) {
      return { value: 'Fizz', type: 'fizz' };
    }
    if (number % 5 === 0) {
      return { value: 'Buzz', type: 'buzz' };
    }
    const isEven = number % 2 === 0;
    return { value: String(number), type: isEven ? 'even' : 'odd' };
  }
}
