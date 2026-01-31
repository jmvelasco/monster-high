import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetFavoritesState } from '../../__tests__/test-utils'
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
      mejoresAmigos: 'Clawdeen Wolf, Frankie Stein',
    },
    globalStory: 'Draculaura es una vampira vegetariana...',
    url: '',
    sections: {},
  },
]

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
)

describe('CharacterDetailPage', () => {
  beforeEach(() => {
    resetFavoritesState()
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCharacters),
      })
    ) as unknown as typeof fetch
  })

  it('muestra loading state mientras carga', () => {
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renderiza CharacterDetail con datos', async () => {
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
    expect(screen.getByText(/vampira vegetariana/i)).toBeInTheDocument()
  })

  it('muestra 404 si slug no existe', async () => {
    render(
      <MemoryRouter initialEntries={['/character/personaje-inexistente']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText(/personaje no encontrado/i)).toBeInTheDocument()
    })
  })

  it('obtiene slug de URL params', async () => {
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByAltText('Draculaura')).toBeInTheDocument()
    })
  })

  it('muestra botón de favoritos sin estado de favorito', async () => {
    render(
      <MemoryRouter initialEntries={['/character/draculaura']}>
        <Routes>
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /favorito|agregar a favoritos/i })
      expect(button).toBeInTheDocument()
    })
  })
})
