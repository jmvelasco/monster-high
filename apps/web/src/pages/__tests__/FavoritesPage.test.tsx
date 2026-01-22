import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetFavoritesState } from '../../__tests__/test-utils'
import { FavoritesPage } from '../FavoritesPage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    resetFavoritesState()
  })

  it('muestra mensaje cuando no hay favoritos', () => {
    renderWithRouter(<FavoritesPage />)

    expect(screen.getByText(/sin favoritos aún/i)).toBeInTheDocument()
  })

  it('renderiza lista de favoritos cuando existen', () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura', 'clawdeen-wolf']))
    
    renderWithRouter(<FavoritesPage />)

    expect(screen.getByText('draculaura')).toBeInTheDocument()
    expect(screen.getByText('clawdeen-wolf')).toBeInTheDocument()
  })

  it('renderiza CharacterCard para cada favorito', () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))
    
    renderWithRouter(<FavoritesPage />)

    // Verifica que el componente CharacterCard está siendo renderizado
    // (busca por atributo data-testid que CharacterCard debe tener)
    expect(screen.getByTestId('character-card-draculaura')).toBeInTheDocument()
  })

  it('muestra botón para explorar personajes cuando no hay favoritos', () => {
    renderWithRouter(<FavoritesPage />)

    const button = screen.getByRole('button', { name: /explorar personajes/i })
    expect(button).toBeInTheDocument()
  })
})
