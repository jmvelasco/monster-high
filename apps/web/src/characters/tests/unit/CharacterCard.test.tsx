import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { Character } from '../../domain/Character'
import { CharacterCard } from '../../infrastructure/ui/CharacterCard/CharacterCard'

describe('CharacterCard', () => {
  it('muestra nombre del personaje', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('muestra imagen del personaje con alt text', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      image: 'https://example.com/draculaura.jpg',
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    const img = screen.getByRole('img', { name: 'Draculaura' })
    expect(img).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  it('muestra placeholder cuando no hay imagen', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      image: undefined,
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    const img = screen.getByRole('img', { name: 'Draculaura' })
    expect(img).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  it('aplica variant="list" correctamente', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('aplica variant="favorite" correctamente', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="favorite" />
      </MemoryRouter>
    )

    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })

  it('navega a detalle on click', async () => {
    const user = userEvent.setup()
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    render(
      <MemoryRouter>
        <CharacterCard character={character} variant="list" />
      </MemoryRouter>
    )

    const card = screen.getAllByRole('link')[0]
    await user.click(card)

    expect(card).toHaveAttribute('href', '/character/draculaura')
  })
})
