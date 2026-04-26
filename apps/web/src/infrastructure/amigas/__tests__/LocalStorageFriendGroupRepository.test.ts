import { describe, it, expect, beforeEach } from 'vitest'
// @ts-ignore
import { LocalStorageFriendGroupRepository } from '../LocalStorageFriendGroupRepository'
import { createFriendGroup } from '../../../domain/amigas/FriendGroup'

describe('LocalStorageFriendGroupRepository', () => {
  let repository: LocalStorageFriendGroupRepository

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageFriendGroupRepository()
  })

  it('should save and find all groups', async () => {
    const group = createFriendGroup({ id: '1', name: 'Vampiras' })

    await repository.save(group)
    const groups = await repository.findAll()

    expect(groups).toHaveLength(1)
    expect(groups[0].name).toBe('Vampiras')
  })

  it('should find a group by id', async () => {
    const group = createFriendGroup({ id: '1', name: 'Vampiras' })
    await repository.save(group)

    const found = await repository.findById('1')
    expect(found?.name).toBe('Vampiras')
  })

  it('should return null if group not found', async () => {
    const found = await repository.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should delete a group', async () => {
    const group = createFriendGroup({ id: '1', name: 'Vampiras' })
    await repository.save(group)

    await repository.delete('1')
    const groups = await repository.findAll()

    expect(groups).toHaveLength(0)
  })
})
