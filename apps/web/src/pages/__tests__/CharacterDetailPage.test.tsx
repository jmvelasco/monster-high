import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../../types/character'
import { CharacterDetailPage } from '../CharacterDetailPage'

const mockCharacters: Character[] = [
  {
    name: 'Draculaura',
    image: '/images/draculaura.jpg',
    technicalInfo: {
      edad: '1600 años',
      sexo: 'Femenino',
      ocupacion: 'Estudiante',
      mascota: 'Count Fabulous',
      familiares: 'Conde Drácula (padre)',
      mejoresAmigos: 'Clawdeen Wolf, Frankie Stein'
    },
    globalStory: 'Draculaura es una vampira vegetariana...',
    url: '',
    sections: {}
  }
]

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCharacters)
    })
  ) as unknown as typeof fetch
})

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

  // TODO: Test 2 - Renderiza CharacterDetail con datos (IN PROGRESS)
  it('renderiza CharacterDetail con datos', async () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    // Assert - Verificar que CharacterDetail se renderizó con datos
    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
    expect(screen.getByText('1600 años')).toBeInTheDocument()
    expect(screen.getByText(/vampira vegetariana/i)).toBeInTheDocument()
  })

  // TODO: Test 3 - Muestra 404 si slug no existe (IN PROGRESS)
  it('muestra 404 si slug no existe', async () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/character/personaje-inexistente']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/personaje no encontrado/i)).toBeInTheDocument()
    })
  })

  // TODO: Test 4 - Obtiene slug de URL params (IN PROGRESS)
  it('obtiene slug de URL params', async () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    // Assert - Si el componente se renderiza correctamente, significa que obtuvo el slug
    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
  })
})
