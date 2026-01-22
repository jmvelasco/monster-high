import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

describe('Header', () => {
  it('muestra logo/título Monster High', () => {
    // Arrange
    const expectedTitle = 'Monster High'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText(expectedTitle)).toBeInTheDocument()
  })

  it('muestra link a "Todos los Personajes"', () => {
    // Arrange
    const expectedLinkText = 'Todos los Personajes'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const link = screen.getByRole('link', { name: expectedLinkText })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/characters')
  })

  it('muestra link a "Favoritos"', () => {
    // Arrange
    const expectedLinkText = 'Favoritos'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const link = screen.getByRole('link', { name: expectedLinkText })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/favorites')
  })

  it('resalta ruta activa', () => {
    // Arrange

    // Act - Navega a /characters
    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const charactersLink = screen.getByRole('link', { name: 'Todos los Personajes' })
    expect(charactersLink).toHaveAttribute('aria-current', 'page')
  })
})
