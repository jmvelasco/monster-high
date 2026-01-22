import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { CharacterDetailPage } from '../CharacterDetailPage'
import type { Character } from '../../types/character'

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
    globalStory: 'Draculaura es una vampira vegetariana...'
  }
]

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

beforeEach(() => {
  global.fetch = vi.fn(() =>
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

  // TODO: Test 3 - Muestra 404 si slug no existe
  // TODO: Test 3 - Muestra 404 si slug no existe
  // TODO: Test 4 - Obtiene slug de URL params
})
