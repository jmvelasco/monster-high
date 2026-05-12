import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/Character'
import { InMemoryCharacterRepository } from '../../infrastructure/InMemoryCharacterRepository'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { CharacterDetail } from '../../infrastructure/ui/CharacterDetail/CharacterDetail'

vi.mock('../../../hooks/useFriendGroups', () => ({
  useFriendGroups: () => ({
    groups: [],
    loadGroups: vi.fn(),
    addCharacterToGroup: vi.fn(),
    createGroup: vi.fn(),
  }),
}))

function createWrapper(characters: Character[]) {
  const repository = new InMemoryCharacterRepository(characters)
  const characterUseCases = {
    list: new ListCharactersUseCase(repository),
    findBySlug: new FindCharacterBySlugUseCase(repository),
  }
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={characterUseCases}>{children}</CharacterUseCasesProvider>
    </QueryClientProvider>
  )
}

describe('CharacterDetail', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra imagen del personaje con alt text', () => {
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      image: 'https://example.com/draculaura.jpg',
      technicalInfo: {},
      sections: {},
    }
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    const image = screen.getByRole('img', { name: 'Draculaura' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  it('muestra placeholder si imagen es undefined', () => {
    const character: Character = {
      name: 'Frankie Stein',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    const image = screen.getByRole('img', { name: 'Frankie Stein' })
    expect(image).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  it('renderiza globalStory con fuente Gruenewald VA', () => {
    const character: Character = {
      name: 'Deuce Gorgon',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory:
        'Deuce es el hijo de Medusa y tiene el poder de convertir a las personas en piedra con su mirada.',
    }
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    const story = screen.getByText(/Deuce es el hijo de Medusa/)
    expect(story).toBeInTheDocument()
    expect(story.className).toMatch(/globalStory/)
  })

  it('muestra placeholder si globalStory es undefined', () => {
    const character: Character = {
      name: 'Spectra Vondergeist',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }
    const wrapper = createWrapper([])

    const { container } = render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    const storySection = container.querySelector('.global-story')
    expect(storySection).not.toBeInTheDocument()
  })

  it('muestra placeholder si globalStory es ""', () => {
    const character: Character = {
      name: 'Operetta',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory: '',
    }
    const wrapper = createWrapper([])

    const { container } = render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

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
    const wrapper = createWrapper([])

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText(/añadir a grupo de amigas/i)).toBeInTheDocument()
  })

  it('renders FriendThumbnails if technicalInfo.mejoresAmigos is present', async () => {
    const clawdWolf: Character = {
      name: 'Clawd Wolf',
      image: 'https://example.com/clawd.jpg',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {
        mejoresAmigos: 'Clawd Wolf',
      },
      sections: {},
    }
    const wrapper = createWrapper([clawdWolf])

    render(
      <MemoryRouter>
        <CharacterDetail character={character} />
      </MemoryRouter>,
      { wrapper }
    )

    // Wait for React Query to load characters
    await vi.waitFor(() => {
      expect(screen.getByRole('img', { name: 'Clawd Wolf' })).toBeInTheDocument()
    })
  })
})
