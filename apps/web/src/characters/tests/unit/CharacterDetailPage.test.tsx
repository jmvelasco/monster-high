import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
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

const mockCharacters: Character[] = [
  {
    name: 'Draculaura',
    image: '/images/draculaura.jpg',
    technicalInfo: {
      edad: '1600 años',
      sexo: 'Femenino',
      ocupacion: 'Estudiante',
      mascota: 'Count Fabulous',
      familiares: 'Conde Drácula (padre)',
      mejoresAmigos: 'Clawdeen Wolf, Frankie Stein',
    },
    globalStory: 'Draculaura es una vampira vegetariana...',
    url: '',
    sections: {},
  },
]

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

describe('CharacterDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra loading state mientras carga', () => {
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renderiza CharacterDetail con datos', async () => {
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
    expect(screen.getByText(/vampira vegetariana/i)).toBeInTheDocument()
  })

  it('muestra 404 si slug no existe', async () => {
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter initialEntries={['/character/personaje-inexistente']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText(/personaje no encontrado/i)).toBeInTheDocument()
    })
  })

  it('obtiene slug de URL params', async () => {
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
  })

  it('displays the group selector for adding to amigas', async () => {
    const wrapper = createWrapper(mockCharacters)

    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText(/añadir a grupo de amigas/i)).toBeInTheDocument()
    })
  })
})
