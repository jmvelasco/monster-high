import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CharacterGrid } from '../CharacterGrid'

const mockCharacters = [
  {
    name: 'Draculaura',
    image: 'https://example.com/draculaura.jpg',
    sections: {},
    technicalInfo: {},
    url: 'https://example.com',
  },
  {
    name: 'Clawdeen',
    image: 'https://example.com/clawdeen.jpg',
    sections: {},
    technicalInfo: {},
    url: 'https://example.com',
  },
]

describe('CharacterGrid - Responsive', () => {
  it('renderiza todos los personajes en mobile (<768px)', () => {
    // Arrange
    window.innerWidth = 500

    // Act
    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    // Assert
    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })

  it('renderiza todos los personajes en tablet (768-1024px)', () => {
    // Arrange
    window.innerWidth = 900

    // Act
    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    // Assert
    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })

  it('renderiza todos los personajes en desktop (>1024px)', () => {
    // Arrange
    window.innerWidth = 1200

    // Act
    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    // Assert
    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })
})
