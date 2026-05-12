import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/Character'
import { InMemoryCharacterRepository } from '../../infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { CharacterDetailPage } from '../../infrastructure/ui/CharacterDetailPage'

vi.mock('../../../hooks/useFriendGroups', () => ({
  useFriendGroups: () => ({
    groups: [],
    loadGroups: vi.fn(),
    addCharacterToGroup: vi.fn(),
    createGroup: vi.fn(),
  }),
}))

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

describe('CharacterDetailPage - Accesibilidad', () => {
  it('muestra mensaje de carga accesible', () => {
    const wrapper = createWrapper([])

    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
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
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText('Error al cargar personaje')).toBeInTheDocument()
    })
  })

  it('muestra mensaje cuando personaje no encontrado', async () => {
    const wrapper = createWrapper([])

    render(
      <MemoryRouter initialEntries={['/character/noexiste']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText('Personaje no encontrado')).toBeInTheDocument()
    })
  })
})
