import { FizzBuzzResult } from '../../../domain/entities/FizzBuzz';
import { ColoredConsoleFizzBuzzPresenter } from '../../../infrastructure/fizzbuzz/ColoredConsoleFizzBuzzPresenter';

const RESET = '\x1b[0m';
const COLORS: Record<string, string> = {
  even: '\x1b[33m',
  odd: '\x1b[32m',
  fizz: '\x1b[36m',
  buzz: '\x1b[35m',
  fizzbuzz: '\x1b[91m',
};

describe('ColoredConsoleFizzBuzzPresenter', () => {
  let presenter: ColoredConsoleFizzBuzzPresenter;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    presenter = new ColoredConsoleFizzBuzzPresenter();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    [{ value: '2', type: 'even' } as FizzBuzzResult],
    [{ value: '3', type: 'odd' } as FizzBuzzResult],
    [{ value: 'Fizz', type: 'fizz' } as FizzBuzzResult],
    [{ value: 'Buzz', type: 'buzz' } as FizzBuzzResult],
    [{ value: 'FizzBuzz', type: 'fizzbuzz' } as FizzBuzzResult],
  ])('wraps a $type result with the correct ANSI color and reset', (result) => {
    presenter.present([result]);

    const expected = `${COLORS[result.type]}${result.value}${RESET}`;
    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  test('joins multiple results with a space', () => {
    const results: FizzBuzzResult[] = [
      { value: '1', type: 'odd' },
      { value: '2', type: 'even' },
      { value: 'Fizz', type: 'fizz' },
    ];

    presenter.present(results);

    const expected = [`${COLORS.odd}1${RESET}`, `${COLORS.even}2${RESET}`, `${COLORS.fizz}Fizz${RESET}`].join(' ');
    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  test('calls console.log exactly once regardless of the number of results', () => {
    const results: FizzBuzzResult[] = [
      { value: '1', type: 'odd' },
      { value: 'Fizz', type: 'fizz' },
      { value: 'Buzz', type: 'buzz' },
    ];

    presenter.present(results);

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test('prints an empty string when given an empty array', () => {
    presenter.present([]);

    expect(logSpy).toHaveBeenCalledWith('');
  });
});
