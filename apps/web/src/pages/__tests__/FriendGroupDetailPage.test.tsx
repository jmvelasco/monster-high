import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import * as useCharactersModule from '../../hooks/useCharacters'
import * as useFriendGroupsModule from '../../hooks/useFriendGroups'
import { FriendGroupDetailPage } from '../FriendGroupDetailPage'

// Mock the hooks
vi.mock('../../hooks/useFriendGroups', () => ({
  useFriendGroups: vi.fn(),
}))

vi.mock('../../hooks/useCharacters', () => ({
  useCharacters: vi.fn(),
}))

describe('FriendGroupDetailPage', () => {
  const mockGetGroupBySlug = vi.fn()
  const mockRemoveGroup = vi.fn()

  const setupMocks = (group: any, characters: any[] = []) => {
    vi.mocked(useFriendGroupsModule.useFriendGroups).mockReturnValue({
      getGroupBySlug: mockGetGroupBySlug.mockResolvedValue(group),
      removeGroup: mockRemoveGroup,
      groups: [],
      loadGroups: vi.fn(),
      createGroup: vi.fn(),
      addCharacterToGroup: vi.fn(),
    })

    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: characters,
      isLoading: false,
      error: undefined,
    })
  }

  const renderComponent = (slug: string) => {
    render(
      <MemoryRouter initialEntries={[`/friends/${slug}`]}>
        <Routes>
          <Route path="/friends/:slug" element={<FriendGroupDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders loading state initially', () => {
    setupMocks(null)
    renderComponent('mis-favs')
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders not found when group does not exist', async () => {
    setupMocks(null)
    renderComponent('mis-favs')

    expect(await screen.findByText('Grupo no encontrado')).toBeInTheDocument()
  })

  it('renders group details correctly', async () => {
    setupMocks({ id: '1', name: 'Mis Favs', slug: 'mis-favs', members: [] })
    renderComponent('mis-favs')

    expect(await screen.findByText('Mis Favs')).toBeInTheDocument()
    expect(screen.getByText('0 amigas')).toBeInTheDocument()
  })

  it('opens confirm dialog when delete is clicked and handles cancellation', async () => {
    setupMocks({ id: '1', name: 'Mis Favs', slug: 'mis-favs', members: [] })
    const user = userEvent.setup()

    renderComponent('mis-favs')

    const deleteButton = await screen.findByRole('button', { name: 'Eliminar grupo' })
    await user.click(deleteButton)

    expect(
      screen.getByText(/¿Estás segura de que quieres eliminar el grupo "Mis Favs"\?/)
    ).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    await user.click(cancelButton)

    expect(
      screen.queryByText(/¿Estás segura de que quieres eliminar el grupo "Mis Favs"\?/)
    ).not.toBeInTheDocument()
    expect(mockRemoveGroup).not.toHaveBeenCalled()
  })
})
