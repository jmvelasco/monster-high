import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { FindCharacterBySlugUseCase } from '../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../characters/application/ListCharactersUseCase'
import type { Character } from '../../characters/domain/Character'
import { InMemoryCharacterRepository } from '../../characters/infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../characters/infrastructure/context/CharacterUseCases.context'
import { useCharacters } from '../useCharacters'

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

describe('useCharacters', () => {
  it('retorna loading state inicialmente', () => {
    const wrapper = createWrapper([])

    const { result } = renderHook(() => useCharacters(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })

  it('fetches personajes desde el repositorio', async () => {
    const characters: Character[] = [
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
    const wrapper = createWrapper(characters)

    const { result } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(characters)
  })

  it('cachea resultado con React Query', async () => {
    const characters: Character[] = [
      { name: 'Clawdeen', image: '', sections: {}, url: '', technicalInfo: {} },
    ]
    const wrapper = createWrapper(characters)

    const { result, rerender } = renderHook(() => useCharacters(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    rerender()

    expect(result.current.data).toEqual(characters)
  })
})
