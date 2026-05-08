import { FizzBuzz } from '../../domain/entities/FizzBuzz';

describe('The FizzBuzz', () => {
  it('labels a regular odd number with its string value and odd type', () => {
    const result = FizzBuzz.convert(1);

    expect(result).toEqual({ value: '1', type: 'odd' });
  });

  it('labels a regular even number with its string value and even type', () => {
    const result = FizzBuzz.convert(2);

    expect(result).toEqual({ value: '2', type: 'even' });
  });

  it('labels a multiple of three as Fizz', () => {
    const result = FizzBuzz.convert(3);

    expect(result).toEqual({ value: 'Fizz', type: 'fizz' });
  });

  it('labels a multiple of five as Buzz', () => {
    const result = FizzBuzz.convert(5);

    expect(result).toEqual({ value: 'Buzz', type: 'buzz' });
  });

  it('labels a multiple of both three and five as FizzBuzz', () => {
    const result = FizzBuzz.convert(15);

    expect(result).toEqual({ value: 'FizzBuzz', type: 'fizzbuzz' });
  });

  it('labels zero as FizzBuzz', () => {
    const result = FizzBuzz.convert(0);

    expect(result).toEqual({ value: 'FizzBuzz', type: 'fizzbuzz' });
  });
});
