export class Maybe<T> {
  private constructor(private readonly value?: T) {}

  static none<T>(): Maybe<T> {
    return new Maybe<T>()
  }

  isNone(): boolean {
    return this.value === undefined
  }

  isSome(): boolean {
    return this.value !== undefined
  }
}
