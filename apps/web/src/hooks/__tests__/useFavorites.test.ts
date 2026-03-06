import { renderHook } from '@testing-library/react'
import { useFavorites } from '../useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna array vacío cuando no hay favoritos', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
  })
})
