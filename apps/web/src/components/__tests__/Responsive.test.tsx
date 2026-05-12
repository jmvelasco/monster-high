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
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={characterUseCases}>{children}</CharacterUseCasesProvider>
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
