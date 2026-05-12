export class Maybe<T> {
  private constructor(private readonly value?: T) {}

  static none<T>(): Maybe<T> {
    return new Maybe<T>()
  }

  static some<T>(value: T): Maybe<T> {
    return new Maybe<T>(value)
  }

  static fromNullable<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe<T>()
  }

  isNone(): boolean {
    return this.value === undefined
  }

  isSome(): boolean {
    return this.value !== undefined
  }
}
