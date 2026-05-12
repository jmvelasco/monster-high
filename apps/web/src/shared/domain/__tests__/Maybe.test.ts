import { Maybe } from '../Maybe'

describe('The Maybe monad', () => {
  it('considers none as not having a value', () => {
    const maybe = Maybe.none()

    expect(maybe.isNone()).toBe(true)
    expect(maybe.isSome()).toBe(false)
  })

  it('considers some as having a value', () => {
    const maybe = Maybe.some(42)

    expect(maybe.isSome()).toBe(true)
    expect(maybe.isNone()).toBe(false)
  })

  it('creates none from null value', () => {
    const maybe = Maybe.fromNullable(null)

    expect(maybe.isNone()).toBe(true)
  })

  it('creates none from undefined value', () => {
    const maybe = Maybe.fromNullable(undefined)

    expect(maybe.isNone()).toBe(true)
  })

  it('creates some from non-null value', () => {
    const maybe = Maybe.fromNullable('hello')

    expect(maybe.isSome()).toBe(true)
  })

  it('folds to none callback when value is absent', () => {
    const maybe = Maybe.none<string>()

    const result = maybe.fold(
      () => 'empty',
      value => value.toUpperCase()
    )

    expect(result).toBe('empty')
  })

  it('folds to some callback when value is present', () => {
    const maybe = Maybe.some('hello')

    const result = maybe.fold(
      () => 'empty',
      value => value.toUpperCase()
    )

    expect(result).toBe('HELLO')
  })

  it('maps the value when some', () => {
    const maybe = Maybe.some(5)

    const result = maybe.map(value => value * 2)

    expect(result.isSome()).toBe(true)
    expect(
      result.fold(
        () => 0,
        value => value
      )
    ).toBe(10)
  })

  it('does not map when none', () => {
    const maybe = Maybe.none<number>()

    const result = maybe.map(value => value * 2)

    expect(result.isNone()).toBe(true)
  })

  it('flat maps the value when some', () => {
    const maybe = Maybe.some(5)

    const result = maybe.flatMap(value => Maybe.some(value * 3))

    expect(result.isSome()).toBe(true)
    expect(
      result.fold(
        () => 0,
        value => value
      )
    ).toBe(15)
  })

  it('does not flat map when none', () => {
    const maybe = Maybe.none<number>()

    const result = maybe.flatMap(value => Maybe.some(value * 3))

    expect(result.isNone()).toBe(true)
  })

  it('returns the value when getting or throwing from some', () => {
    const maybe = Maybe.some('hello')

    const result = maybe.getOrThrow()

    expect(result).toBe('hello')
  })

  it('throws when getting or throwing from none', () => {
    const maybe = Maybe.none<string>()

    expect(() => maybe.getOrThrow()).toThrow()
  })
})
