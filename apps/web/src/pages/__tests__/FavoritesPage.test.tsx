import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesPage } from '../FavoritesPage'
import { resetFavoritesState } from '../../__tests__/test-utils'

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
})
