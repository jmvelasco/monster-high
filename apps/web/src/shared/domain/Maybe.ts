export class Maybe<T> {
  private constructor(private readonly value?: T) {}

  static none<T>(): Maybe<T> {
    return new Maybe<T>()
  }

  static some<T>(value: T): Maybe<T> {
    return new Maybe<T>(value)
  }

  isNone(): boolean {
    return this.value === undefined
  }

  isSome(): boolean {
    return this.value !== undefined
  }
}
