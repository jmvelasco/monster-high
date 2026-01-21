import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SWRConfig } from 'swr'
import type { Character } from '../../types/character'
import { useCharacters } from '../useCharacters'

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  )

  it('retorna loading state inicialmente', () => {
    const { result } = renderHook(() => useCharacters(), { wrapper })

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

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockCharacters)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/characters.json')
  })

  it('retorna error si fetch falla', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    )

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toBe('Failed to fetch characters')
    expect(result.current.data).toBeUndefined()
  })

  it('cachea resultado con SWR', async () => {
    const mockCharacters: Character[] = [{ name: 'Clawdeen', image: '', sections: {}, url: '', technicalInfo: {} }]

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharacters),
      } as Response)
    )

    const { result: result1 } = renderHook(() => useCharacters(), { wrapper })
    
    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false)
    })

    const { result: result2 } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => {
      expect(result2.current.isLoading).toBe(false)
    })

    expect(result2.current.data).toEqual(mockCharacters)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })
})
