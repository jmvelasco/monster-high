import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { Character } from '../../domain/entities/Character'
import { CharacterGrid } from '../../infrastructure/ui/CharacterGrid/CharacterGrid'

const mockCharacter: Character = {
  name: 'Draculaura',
  url: 'https://example.com',
  technicalInfo: {},
  sections: {},
}

describe('CharacterGrid', () => {
  it('muestra mensaje vacío cuando no hay personajes', () => {
    render(
      <BrowserRouter>
        <CharacterGrid characters={[]} />
      </BrowserRouter>
    )

    expect(screen.getByText(/no hay personajes/i)).toBeInTheDocument()
  })

  it('muestra un personaje', () => {
    render(
      <BrowserRouter>
        <CharacterGrid characters={[mockCharacter]} />
      </BrowserRouter>
    )

    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('muestra múltiples personajes en grid', () => {
    const characters: Character[] = [
      { ...mockCharacter, name: 'Draculaura' },
      { ...mockCharacter, name: 'Clawdeen Wolf' },
      { ...mockCharacter, name: 'Frankie Stein' },
    ]

    render(
      <BrowserRouter>
        <CharacterGrid characters={characters} />
      </BrowserRouter>
    )

    expect(screen.getByText('Draculaura')).toBeInTheDocument()
    expect(screen.getByText('Clawdeen Wolf')).toBeInTheDocument()
    expect(screen.getByText('Frankie Stein')).toBeInTheDocument()
  })
})
