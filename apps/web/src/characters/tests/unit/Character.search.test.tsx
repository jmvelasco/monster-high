import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/entities/Character'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { InMemoryCharacterRepository } from '../fakes/InMemoryCharacterRepository'
import { useCharacterSearch } from '../../infrastructure/store/Character.search'

function createWrapper(characters: Character[]) {
  const repository = new InMemoryCharacterRepository(characters)
  const characterUseCases = {
    list: new ListCharactersUseCase(repository),
    findBySlug: new FindCharacterBySlugUseCase(repository),
  }
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={characterUseCases}>{children}</CharacterUseCasesProvider>
    </QueryClientProvider>
  )
}

const testCharacters: Character[] = [
  { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
  { name: 'Clawdeen Wolf', url: '', technicalInfo: {}, sections: {} },
  { name: 'Frankie Stein', url: '', technicalInfo: {}, sections: {} },
]

describe('useCharacterSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('expone searchTerm con valor inicial vacío', () => {
    const wrapper = createWrapper(testCharacters)

    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    expect(result.current.searchTerm).toBe('')
  })

  it('filteredCharacters() devuelve todos los personajes cuando searchTerm es vacío', async () => {
    const wrapper = createWrapper(testCharacters)

    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.filteredCharacters()).toEqual(testCharacters)
  })

  it('filteredCharacters() devuelve solo personajes coincidentes después de que expira el debounce', async () => {
    const wrapper = createWrapper(testCharacters)

    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setSearchTerm('dracu')
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.filteredCharacters()).toHaveLength(1)
    expect(result.current.filteredCharacters()[0].name).toBe('Draculaura')
  })

  it('resetSearch() establece searchTerm a cadena vacía', async () => {
    const wrapper = createWrapper(testCharacters)

    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setSearchTerm('dracu')
    })
    act(() => {
      result.current.resetSearch()
    })

    expect(result.current.searchTerm).toBe('')
  })

  it('expone isLoading del query subyacente como true durante la carga inicial', () => {
    const wrapper = createWrapper(testCharacters)

    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    expect(result.current.isLoading).toBe(true)
  })
})
