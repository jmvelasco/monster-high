import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Character } from '../../../characters/domain/Character'
import { FindCharacterBySlugUseCase } from '../../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../../characters/application/ListCharactersUseCase'
import { InMemoryCharacterRepository } from '../../../characters/infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../../characters/infrastructure/context/CharacterUseCases.context'
import { FriendGroup } from '../../domain/FriendGroup'
import { FriendGroupUseCasesProvider } from '../../infrastructure/context/FriendGroupUseCases.context'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'
import { AddMemberToGroupUseCase } from '../../application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../application/RemoveMemberFromGroupUseCase'
import { FriendGroupDetailPage } from '../../infrastructure/ui/FriendGroupDetailPage'

function createWrapper(characters: Character[], groups: FriendGroup[]) {
  const charRepository = new InMemoryCharacterRepository(characters)
  const characterUseCases = {
    list: new ListCharactersUseCase(charRepository),
    findBySlug: new FindCharacterBySlugUseCase(charRepository),
  }
  const friendGroupRepository = new InMemoryFriendGroupRepository()
  const friendGroupUseCases = {
    list: new ListFriendGroupsUseCase(friendGroupRepository),
    findBySlug: new FindFriendGroupBySlugUseCase(friendGroupRepository),
    create: new CreateFriendGroupUseCase(friendGroupRepository),
    addMember: new AddMemberToGroupUseCase(friendGroupRepository),
    removeMember: new RemoveMemberFromGroupUseCase(friendGroupRepository),
    deleteGroup: new DeleteFriendGroupUseCase(friendGroupRepository),
  }
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const setupGroups = async () => {
    for (const group of groups) {
      await friendGroupRepository.save(group)
    }
  }

  return {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <CharacterUseCasesProvider value={characterUseCases}>
          <FriendGroupUseCasesProvider value={friendGroupUseCases}>
            {children}
          </FriendGroupUseCasesProvider>
        </CharacterUseCasesProvider>
      </QueryClientProvider>
    ),
    setupGroups,
  }
}

function renderComponent(slug: string, characters: Character[], groups: FriendGroup[]) {
  const { wrapper, setupGroups } = createWrapper(characters, groups)
  setupGroups()
  render(
    <MemoryRouter initialEntries={[`/friends/${slug}`]}>
      <Routes>
        <Route path="/friends/:slug" element={<FriendGroupDetailPage />} />
      </Routes>
    </MemoryRouter>,
    { wrapper },
  )
}

describe('FriendGroupDetailPage', () => {
  it('renders not found when group does not exist', async () => {
    renderComponent('mis-favs', [], [])

    expect(await screen.findByText('Grupo no encontrado')).toBeInTheDocument()
  })

  it('renders group details correctly', async () => {
    const group = FriendGroup.fromPrimitives({ id: '1', name: 'Mis Favs', slug: 'mis-favs', members: [] })
    renderComponent('mis-favs', [], [group])

    expect(await screen.findByText('Mis Favs')).toBeInTheDocument()
    expect(screen.getByText('0 amigas')).toBeInTheDocument()
  })

  it('renders members of the group', async () => {
    const group = FriendGroup.fromPrimitives({
      id: '1',
      name: 'Mis Favs',
      slug: 'mis-favs',
      members: ['draculaura'],
    })
    const characters: Character[] = [
      {
        name: 'Draculaura',
        url: '/draculaura',
        image: '/drac.png',
        globalStory: 'Story',
        technicalInfo: {},
        sections: {},
      },
    ]
    renderComponent('mis-favs', characters, [group])

    expect(await screen.findByText('Mis Favs')).toBeInTheDocument()
    expect(screen.getByText('1 amiga')).toBeInTheDocument()
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('opens confirm dialog when delete is clicked and handles cancellation', async () => {
    const group = FriendGroup.fromPrimitives({ id: '1', name: 'Mis Favs', slug: 'mis-favs', members: [] })
    const user = userEvent.setup()
    renderComponent('mis-favs', [], [group])

    const deleteButton = await screen.findByRole('button', { name: 'Eliminar grupo' })
    await user.click(deleteButton)

    expect(
      screen.getByText(/¿Estás segura de que quieres eliminar el grupo "Mis Favs"\?/),
    ).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    await user.click(cancelButton)

    expect(
      screen.queryByText(/¿Estás segura de que quieres eliminar el grupo "Mis Favs"\?/),
    ).not.toBeInTheDocument()
  })

  it('shows remove confirmation dialog for a character', async () => {
    const group = FriendGroup.fromPrimitives({
      id: '1',
      name: 'Mis Favs',
      slug: 'mis-favs',
      members: ['draculaura'],
    })
    const characters: Character[] = [
      {
        name: 'Draculaura',
        url: '/draculaura',
        image: '/drac.png',
        globalStory: 'Story',
        technicalInfo: {},
        sections: {},
      },
    ]
    const user = userEvent.setup()
    renderComponent('mis-favs', characters, [group])

    const removeButton = await screen.findByRole('button', {
      name: 'Quitar a Draculaura del grupo',
    })
    await user.click(removeButton)

    expect(
      screen.getByText(/¿Estás segura de que quieres quitar a Draculaura del grupo "Mis Favs"\?/),
    ).toBeInTheDocument()
  })
})
