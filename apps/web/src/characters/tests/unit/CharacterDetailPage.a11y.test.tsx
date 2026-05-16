import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AddMemberToGroupUseCase } from '../../../friends/application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../../friends/application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../../friends/application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../../friends/application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../../friends/application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../../friends/application/RemoveMemberFromGroupUseCase'
import { FriendGroupUseCasesProvider } from '../../../friends/infrastructure/context/FriendGroupUseCases.context'
import { InMemoryFriendGroupRepository } from '../../../friends/infrastructure/persistence/InMemoryFriendGroupRepository'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/entities/Character'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { InMemoryCharacterRepository } from '../../infrastructure/persistence/InMemoryCharacterRepository'
import { CharacterDetailPage } from '../../infrastructure/ui/CharacterDetailPage'

function createFriendGroupUseCases() {
  const repository = new InMemoryFriendGroupRepository()
  return {
    list: new ListFriendGroupsUseCase(repository),
    findBySlug: new FindFriendGroupBySlugUseCase(repository),
    create: new CreateFriendGroupUseCase(repository),
    addMember: new AddMemberToGroupUseCase(repository),
    removeMember: new RemoveMemberFromGroupUseCase(repository),
    deleteGroup: new DeleteFriendGroupUseCase(repository),
  }
}

function createWrapper(characters: Character[]) {
  const repository = new InMemoryCharacterRepository(characters)
  const characterUseCases = {
    list: new ListCharactersUseCase(repository),
    findBySlug: new FindCharacterBySlugUseCase(repository),
  }
  const friendGroupUseCases = createFriendGroupUseCases()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={characterUseCases}>
        <FriendGroupUseCasesProvider value={friendGroupUseCases}>
          {children}
        </FriendGroupUseCasesProvider>
      </CharacterUseCasesProvider>
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

    expect(screen.getByText('Cargando…')).toBeInTheDocument()
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
