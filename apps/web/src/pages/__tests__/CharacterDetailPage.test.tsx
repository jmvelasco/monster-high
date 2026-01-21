import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { CharacterDetailPage } from '../CharacterDetailPage'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

describe('CharacterDetailPage', () => {
  // TODO: Test 1 - Muestra loading state mientras carga (IN PROGRESS)
  it('muestra loading state mientras carga', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  // TODO: Test 2 - Renderiza CharacterDetail con datos
  // TODO: Test 3 - Muestra 404 si slug no existe
  // TODO: Test 4 - Obtiene slug de URL params
})
