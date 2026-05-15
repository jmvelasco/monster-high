import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AddMemberToGroupUseCase } from '../../application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../application/RemoveMemberFromGroupUseCase'
import { FriendGroupUseCasesProvider } from '../../infrastructure/context/FriendGroupUseCases.context'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'
import { FriendGroupsPage } from '../../infrastructure/ui/FriendGroupsPage'

function createWrapper() {
  const repository = new InMemoryFriendGroupRepository()
  const friendGroupUseCases = {
    list: new ListFriendGroupsUseCase(repository),
    findBySlug: new FindFriendGroupBySlugUseCase(repository),
    create: new CreateFriendGroupUseCase(repository),
    addMember: new AddMemberToGroupUseCase(repository),
    removeMember: new RemoveMemberFromGroupUseCase(repository),
    deleteGroup: new DeleteFriendGroupUseCase(repository),
  }
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <FriendGroupUseCasesProvider value={friendGroupUseCases}>
        {children}
      </FriendGroupUseCasesProvider>
    </QueryClientProvider>
  )
}

describe('The Amigas Page', () => {
  it('displays the page title', async () => {
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    expect(await screen.findByRole('heading', { name: /mis amigas/i })).toBeInTheDocument()
  })

  it('displays an empty state when no groups exist', async () => {
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    expect(await screen.findByText(/no tienes grupos de amigas/i)).toBeInTheDocument()
  })

  it('allows creating a new group', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    const input = await screen.findByPlaceholderText(/nombre del grupo/i)
    const button = screen.getByRole('button', { name: /crear grupo/i })

    await user.type(input, 'Vampiras')
    await user.click(button)

    expect(await screen.findByText('Vampiras')).toBeInTheDocument()
  })

  it('displays groups after creation', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    const input = await screen.findByPlaceholderText(/nombre del grupo/i)
    const button = screen.getByRole('button', { name: /crear grupo/i })

    await user.type(input, 'Vampiras')
    await user.click(button)

    await user.clear(input)
    await user.type(input, 'Lobas')
    await user.click(button)

    expect(await screen.findByText('Vampiras')).toBeInTheDocument()
    expect(screen.getByText('Lobas')).toBeInTheDocument()
  })

  it('group card links to the group detail page', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    const input = await screen.findByPlaceholderText(/nombre del grupo/i)
    const createButton = screen.getByRole('button', { name: /crear grupo/i })

    await user.type(input, 'Mis Favs')
    await user.click(createButton)

    await screen.findByText('Mis Favs')
    const link = screen.getByRole('link', { name: /mis favs/i })
    expect(link).toHaveAttribute('href', '/friends/mis-favs')
  })

  it('creates a group when pressing Enter in the input', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    const input = await screen.findByPlaceholderText(/nombre del grupo/i)
    await user.type(input, 'Fantasmas{Enter}')

    expect(await screen.findByText('Fantasmas')).toBeInTheDocument()
  })

  it('input has an accessible name via aria-label', async () => {
    const wrapper = createWrapper()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>,
      { wrapper }
    )

    const input = await screen.findByRole('textbox', { name: /nombre del grupo/i })
    expect(input).toHaveAttribute('aria-label')
  })
})
