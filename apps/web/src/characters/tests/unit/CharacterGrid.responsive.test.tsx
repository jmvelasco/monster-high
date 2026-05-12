import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CharacterGrid } from '../../infrastructure/ui/CharacterGrid/CharacterGrid'

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
    window.innerWidth = 500

    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })

  it('renderiza todos los personajes en tablet (768-1024px)', () => {
    window.innerWidth = 900

    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })

  it('renderiza todos los personajes en desktop (>1024px)', () => {
    window.innerWidth = 1200

    render(
      <MemoryRouter>
        <CharacterGrid characters={mockCharacters} />
      </MemoryRouter>
    )

    mockCharacters.forEach(char => {
      expect(screen.getByText(char.name)).toBeInTheDocument()
    })
  })
})
