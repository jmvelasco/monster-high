import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CharacterDetail } from '../character/CharacterDetail'

const mockCharacter = {
  image: 'https://example.com/draculaura.jpg',
  name: 'Draculaura',
  sections: {},
  technicalInfo: {},
  url: 'https://example.com',
}

describe('CharacterDetail - Responsive', () => {
  it('renderiza imagen en mobile (<1024px)', () => {
    // Arrange
    window.innerWidth = 500

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText(mockCharacter.name)).toBeInTheDocument()
  })

  it('renderiza imagen en desktop (>1024px)', () => {
    // Arrange
    window.innerWidth = 1200

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={mockCharacter} />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText(mockCharacter.name)).toBeInTheDocument()
  })
})
