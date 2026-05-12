import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/Character'
import { InMemoryCharacterRepository } from '../../infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { CharacterListPage } from '../../infrastructure/ui/CharacterListPage'

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

describe('CharacterListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra loading state mientras carga', () => {
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renderiza CharacterGrid con personajes', async () => {
    const mockCharacters: Character[] = [
      { name: 'Draculaura', image: 'draculaura.jpg', sections: {}, url: '', technicalInfo: {} },
      { name: 'Clawdeen', image: 'clawdeen.jpg', sections: {}, url: '', technicalInfo: {} },
    ]
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
    expect(screen.getByAltText('Clawdeen')).toBeInTheDocument()
  })

  it('muestra error state si fetch falla', async () => {
    const repository = new InMemoryCharacterRepository([])
    vi.spyOn(repository, 'findAll').mockRejectedValue(new Error('Failed to fetch'))
    const characterUseCases = {
      list: new ListCharactersUseCase(repository),
      findBySlug: new FindCharacterBySlugUseCase(repository),
    }
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <CharacterUseCasesProvider value={characterUseCases}>{children}</CharacterUseCasesProvider>
      </QueryClientProvider>
    )

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
