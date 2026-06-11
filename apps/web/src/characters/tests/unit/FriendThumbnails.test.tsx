import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Character } from '../../domain/entities/Character'
import { FriendThumbnails } from '../../infrastructure/ui/FriendThumbnails/FriendThumbnails'

describe('FriendThumbnails', () => {
  const mockCharacters: Character[] = [
    {
      name: 'Draculaura',
      url: '/draculaura',
      technicalInfo: {},
      sections: {},
      image: '/img/draculaura.png',
    },
    {
      name: 'Frankie Stein',
      url: '/frankie',
      technicalInfo: {},
      sections: {},
      image: '/img/frankie.png',
    },
  ]

  it('renders nothing if friends string is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <FriendThumbnails friendsString="" characters={mockCharacters} />
      </MemoryRouter>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('displays images for matched characters', () => {
    render(
      <MemoryRouter>
        <FriendThumbnails friendsString="Draculaura, Frankie Stein" characters={mockCharacters} />
      </MemoryRouter>
    )
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', '/img/draculaura.png')
    expect(images[1]).toHaveAttribute('src', '/img/frankie.png')
  })
})
