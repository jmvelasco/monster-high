import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'

describe('Header - Accesibilidad', () => {
  it('hamburger button tiene aria-label descriptivo', () => {
    // Arrange
    window.innerWidth = 500 // Mobile

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const hamburgerButton = screen.getByRole('button', { name: 'Abrir menú de navegación' })
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Abrir menú de navegación')
  })

  it('header usa semantic HTML con role banner', () => {
    // Arrange
    window.innerWidth = 1024

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header.tagName).toBe('HEADER')
  })

  it('navegación es accesible por teclado (NavLinks)', () => {
    // Arrange
    window.innerWidth = 1024

    // Act
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Assert
    const characterLink = screen.getByRole('link', { name: 'Todos los Personajes' })
    const favoritesLink = screen.getByRole('link', { name: 'Favoritos' })

    // NavLinks son elementos nativos <a>, accesibles por teclado
    expect(characterLink.tagName).toBe('A')
    expect(favoritesLink.tagName).toBe('A')
  })
})
