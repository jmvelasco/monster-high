import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CharacterCard } from '../CharacterCard'
import type { Character } from '../../../types/character'

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
})
