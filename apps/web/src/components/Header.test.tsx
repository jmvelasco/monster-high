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
})
