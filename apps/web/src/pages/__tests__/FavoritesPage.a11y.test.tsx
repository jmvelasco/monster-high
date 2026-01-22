import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCharacters } from '../../hooks/useCharacters'
import { FavoritesPage } from '../FavoritesPage'

// Mock del hook
vi.mock('../../hooks/useCharacters')

describe('FavoritesPage - Accesibilidad', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('titulo h1 accesible cuando no hay favoritos', () => {
    // Arrange - localStorage vacío
    vi.mocked(useCharacters).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    })
    localStorage.clear()

    // Act
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    )

    // Assert - El heading es h1, no h2
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Mis Favoritos')
  })

  it('botón para explorar es accesible', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    })
    localStorage.clear()

    // Act
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    )

    // Assert - Busco botón de exploración
    const button = screen.getByRole('button', { name: /Explorar Personajes/i })
    expect(button).toBeInTheDocument()
  })

  it('página tiene estructura semántica correcta', () => {
    // Arrange
    vi.mocked(useCharacters).mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    })
    localStorage.clear()

    // Act
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    )

    // Assert - Verifica que h1 es el heading principal (semántica correcta)
    const heading = screen.getByRole('heading', { level: 1, name: 'Mis Favoritos' })
    expect(heading).toBeInTheDocument()
  })
})
