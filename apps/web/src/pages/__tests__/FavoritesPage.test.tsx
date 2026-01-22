import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetFavoritesState } from '../../__tests__/test-utils'
import { useCharacters } from '../../hooks/useCharacters'
import { FavoritesPage } from '../FavoritesPage'

// Mock del hook useCharacters
vi.mock('../../hooks/useCharacters')

const mockCharacters = [
  {
    name: 'Draculaura',
    url: 'https://example.com/draculaura',
    image: 'https://example.com/draculaura.jpg',
    technicalInfo: {},
    sections: {},
  },
  {
    name: 'Clawdeen Wolf',
    url: 'https://example.com/clawdeen',
    image: 'https://example.com/clawdeen.jpg',
    technicalInfo: {},
    sections: {},
  },
]

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>)
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    resetFavoritesState()
    vi.clearAllMocks()
  })

  it('muestra mensaje cuando no hay favoritos', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    })
    localStorage.clear()

    // Act
    renderWithRouter(<FavoritesPage />)

    // Assert - Busca el mensaje de sin favoritos aún (en el emptyMessage)
    expect(screen.getByText(/Sin favoritos aún/i)).toBeInTheDocument()
  })

  it('muestra botón para explorar personajes cuando no hay favoritos', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    })
    localStorage.clear()

    // Act
    renderWithRouter(<FavoritesPage />)

    // Assert
    const button = screen.getByRole('button', { name: /explorar personajes/i })
    expect(button).toBeInTheDocument()
  })

  it('renderiza favoritos cuando existen', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    })
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura', 'clawdeen-wolf']))

    // Act
    renderWithRouter(<FavoritesPage />)

    // Assert - Busca los nombres de personajes en las cards
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
    expect(screen.getByText('Clawdeen Wolf')).toBeInTheDocument()
  })

  it('muestra contador de favoritos', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    })
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))

    // Act
    renderWithRouter(<FavoritesPage />)

    // Assert - Verifica que el subtítulo muestra el contador
    expect(screen.getByText(/1 personaje favorito/i)).toBeInTheDocument()
  })

  it('muestra loading state mientras carga', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    })

    // Act
    renderWithRouter(<FavoritesPage />)

    // Assert
    expect(screen.getByText(/Cargando favoritos/i)).toBeInTheDocument()
  })
})
