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

  it('retorna favoritos desde storage', () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura', 'clawdeen-wolf']))
    
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual(['draculaura', 'clawdeen-wolf'])
  })
})

