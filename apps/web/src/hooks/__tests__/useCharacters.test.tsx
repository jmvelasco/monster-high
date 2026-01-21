import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../../types/character'
import { useCharacters } from '../useCharacters'

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna loading state inicialmente', () => {
    const { result } = renderHook(() => useCharacters())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })

  it('fetches personajes desde /api/characters.json', async () => {
    const mockCharacters: Character[] = [
      {
        name: 'Draculaura',
        image: 'draculaura.jpg',
        sections: {
          bio: { title: ['Bio'], content: ['Vampire girl'] },
        },
        url: '',
        technicalInfo: { edad: '16' },
      },
    ]

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharacters),
      } as Response)
    )

    const { result } = renderHook(() => useCharacters())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockCharacters)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/characters.json')
  })
})
