import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Character } from '../../../types/character'
import { CharacterDetail } from '../CharacterDetail'

describe('CharacterDetail', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra imagen del personaje con alt text', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      image: 'https://example.com/draculaura.jpg',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Assert
    const image = screen.getByRole('img', { name: 'Draculaura' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  it('muestra placeholder si imagen es undefined', () => {
    // Arrange
    const character: Character = {
      name: 'Frankie Stein',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Assert
    const image = screen.getByRole('img', { name: 'Frankie Stein' })
    expect(image).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  it('renderiza globalStory con fuente Gruenewald VA', () => {
    // Arrange
    const character: Character = {
      name: 'Deuce Gorgon',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory:
        'Deuce es el hijo de Medusa y tiene el poder de convertir a las personas en piedra con su mirada.',
    }

    // Act
    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Assert
    const story = screen.getByText(/Deuce es el hijo de Medusa/)
    expect(story).toBeInTheDocument()
    // Verificar que tiene la clase CSS Module aplicada (comienza con globalStory)
    expect(story.className).toMatch(/globalStory/)
  })

  it('muestra placeholder si globalStory es undefined', () => {
    // Arrange
    const character: Character = {
      name: 'Spectra Vondergeist',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    const { container } = render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Assert - No debe renderizar sección de historia
    const storySection = container.querySelector('.global-story')
    expect(storySection).not.toBeInTheDocument()
  })

  it('muestra placeholder si globalStory es ""', () => {
    // Arrange
    const character: Character = {
      name: 'Operetta',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory: '',
    }

    // Act
    const { container } = render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Assert - No debe renderizar sección de historia
    const storySection = container.querySelector('.global-story')
    expect(storySection).not.toBeInTheDocument()
  })

  it('displays the group selector section', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    expect(screen.getByText(/añadir a grupo de amigas/i)).toBeInTheDocument()
  })

  it('renders FriendThumbnails if technicalInfo.mejoresAmigos is present', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {
        mejoresAmigos: 'Clawd Wolf',
      },
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>
    )

    // Unmatched character renders initials
    expect(screen.getByText('CW')).toBeInTheDocument()
  })
})
