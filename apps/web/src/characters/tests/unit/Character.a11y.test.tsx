import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import { InMemoryCharacterRepository } from '../../infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { CharacterCard } from '../../infrastructure/ui/CharacterCard/CharacterCard'
import { CharacterDetail } from '../../infrastructure/ui/CharacterDetail/CharacterDetail'
import { FriendGroupUseCasesProvider } from '../../../friends/infrastructure/context/FriendGroupUseCases.context'
import { InMemoryFriendGroupRepository } from '../../../friends/infrastructure/persistence/InMemoryFriendGroupRepository'
import { AddMemberToGroupUseCase } from '../../../friends/application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../../friends/application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../../friends/application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../../friends/application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../../friends/application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../../friends/application/RemoveMemberFromGroupUseCase'

const mockCharacter = {
  image: 'https://example.com/draculaura.jpg',
  name: 'Draculaura',
  sections: {},
  technicalInfo: {},
  url: 'https://example.com',
}

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

function createWrapper() {
  const repository = new InMemoryCharacterRepository([])
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

describe('CharacterCard - Accesibilidad', () => {
  it('imagen tiene texto alternativo descriptivo', () => {
    const characterName = 'Draculaura'

    render(
      <MemoryRouter>
        <CharacterCard character={mockCharacter} variant="favorite" />
      </MemoryRouter>
    )

    const image = screen.getByAltText(characterName)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCharacter.image)
  })
})

describe('CharacterDetail - Accesibilidad', () => {
  it('imagen de personaje tiene texto alternativo descriptivo', () => {
    const characterName = 'Draculaura'
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    const image = screen.getByAltText(characterName)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCharacter.image)
  })

  it('usa semantic HTML: article para contenedor principal', () => {
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })
})
