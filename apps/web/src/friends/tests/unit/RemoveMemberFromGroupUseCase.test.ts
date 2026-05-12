import { describe, expect, it } from 'vitest'
import { FriendGroup } from '../../../domain/friends/FriendGroup'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'
import { RemoveMemberFromGroupUseCase } from '../../application/RemoveMemberFromGroupUseCase'

describe('The RemoveMemberFromGroupUseCase', () => {
  it('removes a member from an existing group', async () => {
    const repository = new InMemoryFriendGroupRepository()
    await repository.save(
      FriendGroup.create({ id: '1', name: 'Vampiras', members: ['draculaura', 'clawdeen'] })
    )
    const useCase = new RemoveMemberFromGroupUseCase(repository)

    await useCase.execute('draculaura', '1')

    const group = await repository.findById('1')
    expect(group?.members).toEqual(['clawdeen'])
  })

  it('does nothing when group does not exist', async () => {
    const repository = new InMemoryFriendGroupRepository()
    const useCase = new RemoveMemberFromGroupUseCase(repository)

    await useCase.execute('draculaura', 'non-existent')

    const groups = await repository.findAll()
    expect(groups).toHaveLength(0)
  })
})
