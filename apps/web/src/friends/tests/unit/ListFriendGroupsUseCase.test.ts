import { describe, expect, it } from 'vitest'
import { ListFriendGroupsUseCase } from '../../application/ListFriendGroupsUseCase'
import { FriendGroup } from '../../domain/entities/FriendGroup'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'

describe('The ListFriendGroupsUseCase', () => {
  it('returns empty list when no groups exist', async () => {
    const repository = new InMemoryFriendGroupRepository()
    const useCase = new ListFriendGroupsUseCase(repository)

    const groups = await useCase.execute()

    expect(groups).toEqual([])
  })

  it('returns all existing groups', async () => {
    const repository = new InMemoryFriendGroupRepository()
    await repository.save(FriendGroup.create({ id: '1', name: 'Vampiras' }))
    await repository.save(FriendGroup.create({ id: '2', name: 'Lobas' }))
    const useCase = new ListFriendGroupsUseCase(repository)

    const groups = await useCase.execute()

    expect(groups).toHaveLength(2)
  })
})
