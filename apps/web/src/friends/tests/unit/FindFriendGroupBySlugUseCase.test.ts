import { describe, expect, it } from 'vitest'
import { FindFriendGroupBySlugUseCase } from '../../application/FindFriendGroupBySlugUseCase'
import { FriendGroup } from '../../domain/entities/FriendGroup'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'

describe('The FindFriendGroupBySlugUseCase', () => {
  it('returns null when group does not exist', async () => {
    const repository = new InMemoryFriendGroupRepository()
    const useCase = new FindFriendGroupBySlugUseCase(repository)

    const group = await useCase.execute('non-existent')

    expect(group).toBeNull()
  })

  it('finds an existing group by its slug', async () => {
    const repository = new InMemoryFriendGroupRepository()
    await repository.save(FriendGroup.create({ id: '1', name: 'Vampiras' }))
    const useCase = new FindFriendGroupBySlugUseCase(repository)

    const group = await useCase.execute('vampiras')

    expect(group?.name).toBe('Vampiras')
  })
})
