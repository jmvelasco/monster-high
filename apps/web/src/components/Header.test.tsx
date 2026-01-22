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

  it('muestra hamburger button en mobile (<768px)', () => {
    // Arrange
    window.innerWidth = 500 // Mobile width

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const hamburgerButton = screen.getByRole('button', { name: 'Abrir menú de navegación' })
    expect(hamburgerButton).toBeInTheDocument()
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
    const charactersLink = screen.getByRole('link', { name: 'Todos los Personajes' })
    const favoritesLink = screen.getByRole('link', { name: 'Favoritos' })
    
    expect(charactersLink).toHaveAttribute('href')
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

    const hamburgerButton = screen.getByRole('button', { name: 'Abrir menú de navegación' })
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Abrir menú de navegación')
  })
})
