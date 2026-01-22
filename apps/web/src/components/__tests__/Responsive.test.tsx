import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'
import { CharacterDetail } from '../character/CharacterDetail'

const mockCharacter = {
  image: 'https://example.com/draculaura.jpg',
  name: 'Draculaura',
  sections: {},
  technicalInfo: {},
  url: 'https://example.com',
}

describe('Header - Responsive', () => {
  it('hamburger button visible en mobile (<768px)', () => {
    // Arrange
    window.innerWidth = 500

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const hamburger = screen.getByRole('button', { name: 'Abrir menú de navegación' })
    expect(hamburger).toBeInTheDocument()
  })

  it('hamburger button NO visible en desktop (>768px)', () => {
    // Arrange
    window.innerWidth = 1024

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    // En desktop, el button no debería renderizarse
    const hamburger = screen.queryByRole('button', { name: 'Abrir menú de navegación' })
    expect(hamburger).not.toBeInTheDocument()
  })
})

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
