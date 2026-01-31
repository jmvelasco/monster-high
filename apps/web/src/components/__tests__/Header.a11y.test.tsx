import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'

describe('Header - Accesibilidad', () => {
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
    const favoritesLink = screen.getByRole('link', { name: '❤️ Mis Favoritos' })

    // NavLinks son elementos nativos <a>, accesibles por teclado
    expect(favoritesLink.tagName).toBe('A')
  })
})
