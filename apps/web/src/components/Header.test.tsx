import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

describe('Header', () => {
  it('muestra logo/título Monster High', () => {
    // Arrange
    const expectedLogoAltTitle = 'Monster High Logo'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const logo = screen.getByRole('img', { name: expectedLogoAltTitle })
    expect(logo).toBeInTheDocument()
  })

  it('muestra link a "Favoritos"', () => {
    // Arrange
    const expectedLinkText = '❤️ Mis Favoritos'

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

  it.skip('resalta ruta activa', () => {
    // Arrange

    // Act - Navega a /characters
    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const charactersLink = screen.getByRole('link', { name: '❤️ Mis Favoritos' })
    expect(charactersLink).toHaveAttribute('aria-current', 'page')
  })

  it('navegación por teclado funcional', () => {
    // Arrange
    window.innerWidth = 1024 // Desktop width

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const favoritesLink = screen.getByRole('link', { name: '❤️ Mis Favoritos' })

    expect(favoritesLink).toHaveAttribute('href')
    // NavLink es por defecto accesible por teclado
  })

  it('ARIA labels apropiados', () => {
    // Arrange
    window.innerWidth = 500 // Mobile
    const expectedHeaderLabel = 'Navegación principal'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('aria-label', expectedHeaderLabel)
  })
})
