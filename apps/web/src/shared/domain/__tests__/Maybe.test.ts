// TODO List:
// [x] 1. Maybe.none() → isNone() true, isSome() false
// [ ] 2. Maybe.some(value) → isSome() true, value accessible
// [ ] 3. Maybe.fromNullable(null) → None; fromNullable(value) → Some
// [ ] 4. fold(onNone, onSome) → executes matching callback
// [ ] 5. map(fn) → transforms if Some, returns None if None
// [ ] 6. flatMap(fn) → like map but fn returns a Maybe
// [ ] 7. getOrThrow() → returns value if Some, throws if None

import { Maybe } from '../Maybe'

describe('The Maybe monad', () => {
  it('considers none as not having a value', () => {
    const maybe = Maybe.none()

    expect(maybe.isNone()).toBe(true)
    expect(maybe.isSome()).toBe(false)
  })
})
