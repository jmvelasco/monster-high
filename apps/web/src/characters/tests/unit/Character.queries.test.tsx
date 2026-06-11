import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/entities/Character'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { InMemoryCharacterRepository } from '../fakes/InMemoryCharacterRepository'
import { useCharactersQuery } from '../../infrastructure/store/Character.queries'

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

describe('The Characters Query', () => {
  it('exposes loading state initially', () => {
    const wrapper = createWrapper([])

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    expect(result.current.isLoading).toBe(true)
  })

  it('exposes characters as a function returning the list', async () => {
    const characters: Character[] = [
      { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
    ]
    const wrapper = createWrapper(characters)

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.characters()).toEqual(characters)
  })

  it('identifies when characters exist', async () => {
    const characters: Character[] = [
      { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
    ]
    const wrapper = createWrapper(characters)

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.hasCharacters()).toBe(true)
  })

  it('identifies when no characters exist', async () => {
    const wrapper = createWrapper([])

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.hasCharacters()).toBe(false)
  })

  it('finds a character by slug', async () => {
    const characters: Character[] = [
      { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
    ]
    const wrapper = createWrapper(characters)

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const found = result.current.findBySlug('draculaura')
    expect(found.isSome()).toBe(true)
    expect(found.getOrThrow().name).toBe('Draculaura')
  })

  it('returns none for unknown slug', async () => {
    const characters: Character[] = [
      { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
    ]
    const wrapper = createWrapper(characters)

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const found = result.current.findBySlug('unknown-character')
    expect(found.isNone()).toBe(true)
  })

  it('exposes empty error message when no error occurs', async () => {
    const wrapper = createWrapper([])

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.errorMessage()).toBe('')
  })

  it('does not expose raw React Query internals', async () => {
    const wrapper = createWrapper([])

    const { result } = renderHook(() => useCharactersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current).not.toHaveProperty('data')
    expect(result.current).not.toHaveProperty('error')
    expect(result.current).not.toHaveProperty('isError')
    expect(result.current).not.toHaveProperty('isSuccess')
  })
})
