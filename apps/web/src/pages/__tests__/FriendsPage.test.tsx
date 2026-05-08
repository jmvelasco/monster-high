import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { FriendGroupsPage } from '../FriendGroupsPage'

describe('The Amigas Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('displays the page title', () => {
    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /mis amigas/i })).toBeInTheDocument()
  })

  it('displays an empty state when no groups exist', () => {
    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/no tienes grupos de amigas/i)).toBeInTheDocument()
  })

  it('allows creating a new group', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/nombre del grupo/i)
    const button = screen.getByRole('button', { name: /crear grupo/i })

    await user.type(input, 'Vampiras')
    await user.click(button)

    expect(await screen.findByText('Vampiras')).toBeInTheDocument()
  })

  it('displays groups after creation', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/nombre del grupo/i)
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

    render(
      <MemoryRouter>
        <FriendGroupsPage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/nombre del grupo/i)
    const createButton = screen.getByRole('button', { name: /crear grupo/i })

    await user.type(input, 'Mis Favs')
    await user.click(createButton)

    await screen.findByText('Mis Favs')
    const link = screen.getByRole('link', { name: /mis favs/i })
    expect(link).toHaveAttribute('href', '/friends/mis-favs')
  })
})
