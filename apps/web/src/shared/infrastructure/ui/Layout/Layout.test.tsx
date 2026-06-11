import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renderiza Header', () => {
    // Arrange
    const expectedLogoAltTitle = 'Monster High Logo'

    // Act
    render(
      <MemoryRouter>
        <Layout>
          <div>Contenido de página</div>
        </Layout>
      </MemoryRouter>
    )

    // Assert
    const logo = screen.getByRole('img', { name: expectedLogoAltTitle })
    expect(logo).toBeInTheDocument()
  })

  it('renderiza children correctamente', () => {
    // Arrange
    const expectedContent = 'Soy el contenido de la página'

    // Act
    render(
      <MemoryRouter>
        <Layout>
          <div>{expectedContent}</div>
        </Layout>
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText(expectedContent)).toBeInTheDocument()
  })

  it('Header visible en todas las páginas', () => {
    // Arrange

    // Act
    render(
      <MemoryRouter>
        <Layout>
          <div>Cualquier contenido de página</div>
        </Layout>
      </MemoryRouter>
    )

    // Assert
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders a skip link targeting main content', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    )

    const skipLink = screen.getByRole('link', { name: /saltar al contenido/i })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})
