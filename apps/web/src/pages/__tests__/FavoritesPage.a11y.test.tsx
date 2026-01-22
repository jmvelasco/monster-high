import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FavoritesPage } from '../FavoritesPage'

describe('FavoritesPage - Accesibilidad', () => {
  it('titulo h1 accesible cuando no hay favoritos', () => {
    // Arrange - localStorage vacío
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

  it('botón de navegación tiene atributo accesible', () => {
    // Arrange
    localStorage.clear()

    // Act
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    )

    // Assert - Busco botón de exploración
    const button = screen.getByRole('button', { name: 'Explorar Personajes' })
    expect(button).toBeInTheDocument()
  })

  it('página tiene estructura semántica correcta', () => {
    // Arrange
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
