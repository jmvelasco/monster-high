import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useCharacter } from '../../hooks/useCharacter'
import { CharacterDetailPage } from '../CharacterDetailPage'

// Mock del hook
vi.mock('../../hooks/useCharacter')

describe('CharacterDetailPage - Accesibilidad', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('muestra mensaje de carga accesible', () => {
    // Arrange
    vi.mocked(useCharacter).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    })

    // Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('muestra mensaje de error accesible', () => {
    // Arrange
    vi.mocked(useCharacter).mockReturnValue({
      data: undefined,
      error: new Error('Network error'),
      isLoading: false,
    })

    // Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Error al cargar personaje')).toBeInTheDocument()
  })

  it('muestra mensaje cuando personaje no encontrado', () => {
    // Arrange
    vi.mocked(useCharacter).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    })

    // Act
    render(
      <MemoryRouter initialEntries={['/character/noexiste']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Personaje no encontrado')).toBeInTheDocument()
  })

  it('renderiza CharacterDetail con accesibilidad completa', () => {
    // Arrange
    const mockCharacter = {
      name: 'Draculaura',
      image: 'https://example.com/draculaura.jpg',
      sections: {},
      technicalInfo: {},
      url: 'test',
    }
    vi.mocked(useCharacter).mockReturnValue({
      data: mockCharacter,
      error: null,
      isLoading: false,
    })

    // Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByAltText(mockCharacter.name)).toBeInTheDocument()
  })
})
