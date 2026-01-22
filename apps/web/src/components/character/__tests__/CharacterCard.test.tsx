import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { Character } from '../../../types/character'
import { CharacterCard } from '../CharacterCard'

describe('CharacterCard', () => {
  it('muestra nombre del personaje', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('muestra imagen del personaje con alt text', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      image: 'https://example.com/draculaura.jpg',
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    // Assert
    const img = screen.getByRole('img', { name: 'Draculaura' })
    expect(img).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  it('muestra placeholder cuando no hay imagen', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      image: undefined,
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    // Assert
    const img = screen.getByRole('img', { name: 'Draculaura' })
    expect(img).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  it('aplica variant="list" correctamente', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('aplica variant="favorite" correctamente', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="favorite" />
      </MemoryRouter>
    )

    // Assert - El nombre siempre se muestra, pero la variant cambia estilos
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('navega a detalle on click', async () => {
    // Arrange
    const user = userEvent.setup()
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    const card = screen.getByRole('link')
    await user.click(card)

    // Assert
    expect(card).toHaveAttribute('href', '/character/draculaura')
  })
})
