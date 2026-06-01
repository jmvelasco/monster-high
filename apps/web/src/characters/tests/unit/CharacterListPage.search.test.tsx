import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../application/ListCharactersUseCase'
import type { Character } from '../../domain/entities/Character'
import { CharacterUseCasesProvider } from '../../infrastructure/context/CharacterUseCases.context'
import { InMemoryCharacterRepository } from '../fakes/InMemoryCharacterRepository'
import { CharacterListPage } from '../../infrastructure/ui/CharacterListPage'

const testCharacters: Character[] = [
  { name: 'Draculaura', url: '', technicalInfo: {}, sections: {} },
  { name: 'Clawdeen Wolf', url: '', technicalInfo: {}, sections: {} },
  { name: 'Frankie Stein', url: '', technicalInfo: {}, sections: {} },
]

function createWrapper(characters: Character[]) {
  const repository = new InMemoryCharacterRepository(characters)
  const characterUseCases = {
    list: new ListCharactersUseCase(repository),
    findBySlug: new FindCharacterBySlugUseCase(repository),
  }
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={characterUseCases}>{children}</CharacterUseCasesProvider>
    </QueryClientProvider>
  )
}

describe('CharacterListPage - Búsqueda reactiva', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza el campo de búsqueda en la página principal', async () => {
    const wrapper = createWrapper(testCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })
  })

  it('al escribir en el campo y avanzar el debounce, la grid muestra solo los personajes coincidentes', async () => {
    const wrapper = createWrapper(testCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText('Draculaura')).toBeInTheDocument()
    })

    await userEvent.type(screen.getByRole('searchbox'), 'dracu')

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('Draculaura')).toBeInTheDocument()
      expect(screen.queryByText('Clawdeen Wolf')).not.toBeInTheDocument()
      expect(screen.queryByText('Frankie Stein')).not.toBeInTheDocument()
    })
  })

  it('al hacer clic en el botón de reset, la grid vuelve a mostrar todos los personajes', async () => {
    const wrapper = createWrapper(testCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText('Draculaura')).toBeInTheDocument()
    })

    await userEvent.type(screen.getByRole('searchbox'), 'dracu')

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.queryByText('Clawdeen Wolf')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: /limpiar/i }))

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('Draculaura')).toBeInTheDocument()
      expect(screen.getByText('Clawdeen Wolf')).toBeInTheDocument()
      expect(screen.getByText('Frankie Stein')).toBeInTheDocument()
    })
  })

  it("cuando la búsqueda no coincide con ningún personaje, muestra 'No se encontraron personajes'", async () => {
    const wrapper = createWrapper(testCharacters)

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>,
      { wrapper }
    )

    await waitFor(() => {
      expect(screen.getByText('Draculaura')).toBeInTheDocument()
    })

    await userEvent.type(screen.getByRole('searchbox'), 'xyz-no-match')

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    await waitFor(() => {
      expect(screen.getByText('No se encontraron personajes')).toBeInTheDocument()
    })
  })
})
