export class Maybe<T> {
  private constructor(private readonly value?: T) {}

  static none<T>(): Maybe<T> {
    return new Maybe<T>()
  }

  static some<T>(value: T): Maybe<T> {
    return new Maybe<T>(value)
  }

  static fromNullable<T>(value: T | null | undefined): Maybe<T> {
    if (value === null || value === undefined) {
      return Maybe.none<T>()
    }
    return Maybe.some(value)
  }

  isNone(): boolean {
    return this.value === undefined
  }

  isSome(): boolean {
    return this.value !== undefined
  }

  fold<R>(onNone: () => R, onSome: (value: T) => R): R {
    if (this.isNone()) {
      return onNone()
    }
    return onSome(this.value as T)
  }
}
