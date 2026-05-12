import { describe, expect, it } from 'vitest'
import { FriendGroup } from '../../../domain/friends/FriendGroup'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'
import { DeleteFriendGroupUseCase } from '../../application/DeleteFriendGroupUseCase'

describe('The DeleteFriendGroupUseCase', () => {
  it('deletes an existing group', async () => {
    const repository = new InMemoryFriendGroupRepository()
    await repository.save(FriendGroup.create({ id: '1', name: 'Vampiras' }))
    const useCase = new DeleteFriendGroupUseCase(repository)

    await useCase.execute('1')

    const remaining = await repository.findAll()
    expect(remaining).toHaveLength(0)
  })
})
