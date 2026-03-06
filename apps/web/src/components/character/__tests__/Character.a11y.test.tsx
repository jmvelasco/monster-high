import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CharacterCard } from '../CharacterCard'
import { CharacterDetail } from '../CharacterDetail'

const mockCharacter = {
  image: 'https://example.com/draculaura.jpg',
  name: 'Draculaura',
  sections: {},
  technicalInfo: {},
  url: 'https://example.com',
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

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>
    )

    // Assert
    const image = screen.getByAltText(characterName)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCharacter.image)
  })

  it('usa semantic HTML: article para contenedor principal', () => {
    // Arrange

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>
    )

    // Assert
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()
  })
})
