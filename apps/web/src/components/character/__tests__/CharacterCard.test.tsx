import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
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
      <BrowserRouter>
        <CharacterCard character={character} variant="list" />
      </BrowserRouter>
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
      <BrowserRouter>
        <CharacterCard character={character} variant="list" />
      </BrowserRouter>
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
      <BrowserRouter>
        <CharacterCard character={character} variant="list" />
      </BrowserRouter>
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
      <BrowserRouter>
        <CharacterCard character={character} variant="list" />
      </BrowserRouter>
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
      <BrowserRouter>
        <CharacterCard character={character} variant="favorite" />
      </BrowserRouter>
    )

    // Assert
    expect(screen.queryByText('Draculaura')).not.toBeInTheDocument()
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
      <BrowserRouter>
        <CharacterCard character={character} variant="list" />
      </BrowserRouter>
    )

    const card = screen.getByRole('link')
    await user.click(card)

    // Assert
    expect(card).toHaveAttribute('href', '/character/draculaura')
  })
})
