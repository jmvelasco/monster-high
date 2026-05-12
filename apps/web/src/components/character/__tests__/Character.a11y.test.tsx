import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { FindCharacterBySlugUseCase } from '../../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../../characters/application/ListCharactersUseCase'
import { InMemoryCharacterRepository } from '../../../characters/infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../../characters/infrastructure/context/CharacterUseCases.context'
import { CharacterCard } from '../CharacterCard'
import { CharacterDetail } from '../CharacterDetail'

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

describe('CharacterCard - Accesibilidad', () => {
  it('imagen tiene texto alternativo descriptivo', () => {
    // Arrange
    const characterName = 'Draculaura'

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={mockCharacter} variant="favorite" />
      </MemoryRouter>
    )

    // Assert
    const image = screen.getByAltText(characterName)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCharacter.image)
  })
})

describe('CharacterDetail - Accesibilidad', () => {
  it('imagen de personaje tiene texto alternativo descriptivo', () => {
    // Arrange
    const characterName = 'Draculaura'
    const wrapper = createWrapper()

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    const image = screen.getByAltText(characterName)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCharacter.image)
  })

  it('usa semantic HTML: article para contenedor principal', () => {
    // Arrange
    const wrapper = createWrapper()

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })
})
