import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Character } from '../../../types/character'
import { CharacterDetail } from '../CharacterDetail'

describe('CharacterDetail', () => {
  // BLOQUE 1: Imagen del personaje
  
  // TODO: Test 1 - Muestra imagen del personaje con alt text (IN PROGRESS)
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
    render(<CharacterDetail character={character} />)

    // Assert
    const image = screen.getByRole('img', { name: 'Draculaura' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  // TODO: Test 2 - Muestra placeholder si imagen es undefined (IN PROGRESS)
  it('muestra placeholder si imagen es undefined', () => {
    // Arrange
    const character: Character = {
      name: 'Frankie Stein',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    const image = screen.getByRole('img', { name: 'Frankie Stein' })
    expect(image).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  // BLOQUE 2: Ficha técnica (4 tests)
  // BLOQUE 3: Historia (3 tests)
  // BLOQUE 4: Layout responsive (2 tests)
  // BLOQUE 5: Navegación (1 test)
})
