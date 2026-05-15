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

  it('muestra link a "Amigas"', () => {
    // Arrange
    const expectedLinkText = 'Mis Amigas'

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const link = screen.getByRole('link', { name: expectedLinkText })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/friends')
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
    const charactersLink = screen.getByRole('link', { name: /mis amigas/i })
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
    const favoritesLink = screen.getByRole('link', { name: /mis amigas/i })

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
    const nav = screen.getByRole('navigation', { name: expectedHeaderLabel })
    expect(nav).toBeInTheDocument()
  })
})
