import { describe, expect, it } from 'vitest'
import { InMemoryFriendGroupRepository } from '../../infrastructure/persistence/InMemoryFriendGroupRepository'
import { CreateFriendGroupUseCase } from '../../application/CreateFriendGroupUseCase'

describe('The CreateFriendGroupUseCase', () => {
  it('creates a group and persists it', async () => {
    const repository = new InMemoryFriendGroupRepository()
    const useCase = new CreateFriendGroupUseCase(repository)

    await useCase.execute('Vampiras')

    const groups = await repository.findAll()
    expect(groups).toHaveLength(1)
    expect(groups[0].name).toBe('Vampiras')
    expect(groups[0].slug).toBe('vampiras')
    expect(groups[0].id).toBeDefined()
    expect(groups[0].members).toEqual([])
  })
})
