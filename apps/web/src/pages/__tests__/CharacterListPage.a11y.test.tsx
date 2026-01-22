import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useCharacters } from '../../hooks/useCharacters'
import { CharacterListPage } from '../CharacterListPage'

// Mock del hook
vi.mock('../../hooks/useCharacters')

describe('CharacterListPage - Accesibilidad', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('muestra mensaje de carga accesible', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    })

    // Act
    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Cargando personajes...')).toBeInTheDocument()
  })

  it('muestra mensaje de error accesible', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: undefined,
      error: new Error('Network error'),
      isLoading: false,
    })

    // Act
    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Error al cargar personajes')).toBeInTheDocument()
  })

  it('renderiza CharacterGrid con accesibilidad completa', () => {
    // Arrange
    const mockCharacters = [
      { name: 'Draculaura', slug: 'draculaura', image: 'test.jpg', sections: {}, technicalInfo: {}, url: 'test' },
    ]
    vi.mocked(useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    })

    // Act
    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
  })
})
