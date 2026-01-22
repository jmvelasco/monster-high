import { act, renderHook } from '@testing-library/react'
import { __resetInMemoryFavorites } from '../../utils/favoritesStorage'
import { useFavorites } from '../useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetInMemoryFavorites()
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

  it('agrega slug a favoritos cuando no está', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('draculaura')
    })

    expect(result.current.favorites).toContain('draculaura')
  })

  it('elimina slug de favoritos cuando está', () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('draculaura')
    })

    expect(result.current.favorites).not.toContain('draculaura')
  })

  it('expone función isFavorite', () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isFavorite('draculaura')).toBe(true)
    expect(result.current.isFavorite('clawdeen-wolf')).toBe(false)
  })

  it('sincroniza favoritos después de toggle', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])

    act(() => {
      result.current.toggleFavorite('draculaura')
    })

    expect(result.current.favorites).toEqual(['draculaura'])

    act(() => {
      result.current.toggleFavorite('clawdeen-wolf')
    })

    expect(result.current.favorites).toEqual(['draculaura', 'clawdeen-wolf'])
  })
})


