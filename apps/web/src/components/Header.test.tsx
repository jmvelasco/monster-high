import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'

describe('Header', () => {
  it('muestra logo/título Monster High', () => {
    // Arrange
    const expectedTitle = 'Monster High'

    // Act
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    // Assert
    expect(screen.getByText(expectedTitle)).toBeInTheDocument()
  })

  it('muestra link a "Todos los Personajes"', () => {
    // Arrange
    const expectedLinkText = 'Todos los Personajes'

    // Act
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
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
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    // Assert
    const link = screen.getByRole('link', { name: expectedLinkText })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/favorites')
  })
})
