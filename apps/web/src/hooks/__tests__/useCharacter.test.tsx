import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { useCharacter } from '../useCharacter'
import type { Character } from '../../types/character'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

describe('useCharacter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // TODO: Test 1 - Retorna personaje por slug (IN PROGRESS)
  it('retorna personaje por slug', async () => {
    // Arrange
    const mockCharacters: Character[] = [
      {
        name: 'Draculaura',
        url: 'https://example.com/draculaura',
        technicalInfo: { edad: '1600' },
        sections: {},
      },
    ]

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharacters),
      } as Response)
    )

    const slug = 'draculaura'

    // Act
    const { result } = renderHook(() => useCharacter(slug), { wrapper })

    // Assert
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('Draculaura')
    })
  })

  // TODO: Test 2 - Retorna undefined si slug no existe (IN PROGRESS)
  it('retorna undefined si slug no existe', async () => {
    // Arrange
    const mockCharacters: Character[] = [
      {
        name: 'Draculaura',
        url: 'https://example.com/draculaura',
        technicalInfo: {},
        sections: {},
      },
    ]

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharacters),
      } as Response)
    )

    const slug = 'personaje-inexistente'

    // Act
    const { result } = renderHook(() => useCharacter(slug), { wrapper })

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeUndefined()
  })

  // TODO: Test 3 - Maneja loading state (IN PROGRESS)
  it('maneja loading state', () => {
    // Arrange
    globalThis.fetch = vi.fn(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    )

    // Act
    const { result } = renderHook(() => useCharacter('any-slug'), { wrapper })

    // Assert
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })
})
