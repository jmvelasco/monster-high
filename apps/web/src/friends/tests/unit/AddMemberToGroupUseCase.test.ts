import { describe, expect, it } from 'vitest'
import { AddMemberToGroupUseCase } from '../../application/AddMemberToGroupUseCase'
import { FriendGroup } from '../../domain/entities/FriendGroup'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'

describe('The AddMemberToGroupUseCase', () => {
  it('adds a member to an existing group', async () => {
    const repository = new InMemoryFriendGroupRepository()
    await repository.save(FriendGroup.create({ id: '1', name: 'Vampiras' }))
    const useCase = new AddMemberToGroupUseCase(repository)

    await useCase.execute('draculaura', '1')

    const group = await repository.findById('1')
    expect(group?.members).toContain('draculaura')
  })

  it('does nothing when group does not exist', async () => {
    const repository = new InMemoryFriendGroupRepository()
    const useCase = new AddMemberToGroupUseCase(repository)

    await useCase.execute('draculaura', 'non-existent')

    const groups = await repository.findAll()
    expect(groups).toHaveLength(0)
  })
})
