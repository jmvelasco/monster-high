import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CharacterGrid } from '../CharacterGrid'
import type { Character } from '../../../types/character'

const mockCharacter: Character = {
  name: 'Draculaura',
  url: 'https://example.com',
  technicalInfo: {},
  sections: {},
}

describe('CharacterGrid', () => {
  it('muestra mensaje vacío cuando no hay personajes', () => {
    // Act
    render(
      <BrowserRouter>
        <CharacterGrid characters={[]} />
      </BrowserRouter>
    )

    // Assert
    expect(screen.getByText(/no hay personajes/i)).toBeInTheDocument()
  })

  it('muestra un personaje', () => {
    // Act
    render(
      <BrowserRouter>
        <CharacterGrid characters={[mockCharacter]} />
      </BrowserRouter>
    )

    // Assert
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })
})
