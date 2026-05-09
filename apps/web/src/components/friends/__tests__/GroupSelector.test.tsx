import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FriendGroup } from '../../../domain/friends/FriendGroup'
import { GroupSelector } from '../GroupSelector'

describe('The Group Selector', () => {
  const groups: FriendGroup[] = [
    FriendGroup.fromPrimitives({ id: '1', name: 'Vampiras', slug: 'vampiras', members: [] }),
    FriendGroup.fromPrimitives({ id: '2', name: 'Lobas', slug: 'lobas', members: ['draculaura'] }),
  ]

  it('displays existing groups as options', () => {
    render(
      <GroupSelector
        groups={groups}
        characterSlug="frankie-stein"
        onAddToGroup={vi.fn()}
        onCreateGroup={vi.fn()}
      />
    )

    expect(screen.getByText('Vampiras')).toBeInTheDocument()
    expect(screen.getByText('Lobas')).toBeInTheDocument()
  })

  it('calls onAddToGroup when selecting a group', async () => {
    const user = userEvent.setup()
    const onAddToGroup = vi.fn()

    render(
      <GroupSelector
        groups={groups}
        characterSlug="frankie-stein"
        onAddToGroup={onAddToGroup}
        onCreateGroup={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /vampiras/i }))

    expect(onAddToGroup).toHaveBeenCalledWith('frankie-stein', '1')
  })

  it('shows a visual indicator when character is already in a group', () => {
    render(
      <GroupSelector
        groups={groups}
        characterSlug="draculaura"
        onAddToGroup={vi.fn()}
        onCreateGroup={vi.fn()}
      />
    )

    const lobasButton = screen.getByRole('button', { name: /lobas/i })
    expect(lobasButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('allows creating a new group from the selector', async () => {
    const user = userEvent.setup()
    const onCreateGroup = vi.fn()

    render(
      <GroupSelector
        groups={groups}
        characterSlug="frankie-stein"
        onAddToGroup={vi.fn()}
        onCreateGroup={onCreateGroup}
      />
    )

    const input = screen.getByPlaceholderText(/nuevo grupo/i)
    const button = screen.getByRole('button', { name: /crear/i })

    await user.type(input, 'BFFs')
    await user.click(button)

    expect(onCreateGroup).toHaveBeenCalledWith('BFFs')
  })
})
