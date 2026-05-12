export class Maybe<T> {
  static none<T>(): Maybe<T> {
    return new Maybe<T>()
  }

  isNone(): boolean {
    return false
  }

  isSome(): boolean {
    return false
  }
}
