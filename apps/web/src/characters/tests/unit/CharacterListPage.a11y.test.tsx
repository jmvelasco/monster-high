import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
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

describe('CharacterListPage - Accesibilidad', () => {
  it('muestra mensaje de carga accesible', () => {
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText('Cargando personajes...')).toBeInTheDocument()
  })

  it('muestra mensaje de error accesible', async () => {
    const repository = new InMemoryCharacterRepository([])
    vi.spyOn(repository, 'findAll').mockRejectedValue(new Error('Network error'))
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
      expect(screen.getByText('Error al cargar personajes')).toBeInTheDocument()
    })
  })

  it('renderiza CharacterGrid con accesibilidad completa', async () => {
    const mockCharacters: Character[] = [
      {
        name: 'Draculaura',
        image: 'test.jpg',
        sections: {},
        technicalInfo: {},
        url: 'test',
      },
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
  })

  it('renders an h1 heading for the page', async () => {
    const mockCharacters: Character[] = [
      {
        name: 'Draculaura',
        image: 'test.jpg',
        sections: {},
        technicalInfo: {},
        url: 'test',
      },
    ]
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })
})
