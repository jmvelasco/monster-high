import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { FindCharacterBySlugUseCase } from '../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../characters/application/ListCharactersUseCase'
import { CharacterUseCasesProvider } from '../../characters/infrastructure/context/CharacterUseCases.context'
import { InMemoryCharacterRepository } from '../../characters/infrastructure/InMemoryCharacterRepository'
import { CharacterDetail } from '../../characters/infrastructure/ui/CharacterDetail/CharacterDetail'
import { Header } from '../Header'
import { FriendGroupUseCasesProvider } from '../../friends/infrastructure/context/FriendGroupUseCases.context'
import { InMemoryFriendGroupRepository } from '../../friends/infrastructure/persistence/InMemoryFriendGroupRepository'
import { AddMemberToGroupUseCase } from '../../friends/application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../friends/application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../friends/application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../friends/application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../friends/application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../friends/application/RemoveMemberFromGroupUseCase'

const mockCharacter = {
  image: 'https://example.com/draculaura.jpg',
  name: 'Draculaura',
  sections: {},
  technicalInfo: {},
  url: 'https://example.com',
}

function createWrapper() {
  const repository = new InMemoryCharacterRepository([])
  const characterUseCases = {
    list: new ListCharactersUseCase(repository),
    findBySlug: new FindCharacterBySlugUseCase(repository),
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

describe('CharacterDetail - Responsive', () => {
  it('renderiza imagen en mobile (<1024px)', () => {
    // Arrange
    window.innerWidth = 500
    const wrapper = createWrapper()

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    expect(screen.getByAltText(mockCharacter.name)).toBeInTheDocument()
  })

  it('renderiza imagen en desktop (>1024px)', () => {
    // Arrange
    window.innerWidth = 1200
    const wrapper = createWrapper()

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    expect(screen.getByAltText(mockCharacter.name)).toBeInTheDocument()
  })
})

describe('Header - Responsive', () => {
  it('renderiza logo/título Monster High en mobile (<1024px)', () => {
    // Arrange
    window.innerWidth = 500

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText('Monster High Mobile Logo')).toBeInTheDocument()
  })

  it('renderiza logo/título Monster High en desktop (>1024px)', () => {
    // Arrange
    window.innerWidth = 1200

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText('Monster High Logo')).toBeInTheDocument()
  })
})
