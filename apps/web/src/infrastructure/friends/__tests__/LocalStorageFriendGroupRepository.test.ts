import { beforeEach, describe, expect, it } from 'vitest'
import { createFriendGroup } from '../../../domain/friends/FriendGroup'
import { LocalStorageFriendGroupRepository } from '../LocalStorageFriendGroupRepository'

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

  it('should find a group by slug', async () => {
    const group = createFriendGroup({ id: '1', name: 'Mis Favs' }) // slug will be 'mis-favs'
    await repository.save(group)

    const found = await repository.findBySlug('mis-favs')
    expect(found?.name).toBe('Mis Favs')
  })

  it('should return null if group not found by slug', async () => {
    const found = await repository.findBySlug('non-existent-slug')
    expect(found).toBeNull()
  })

  it('should generate slug for legacy groups missing it when finding all', async () => {
    // Manually insert legacy data
    localStorage.setItem(
      'monster-high-amigas',
      JSON.stringify([{ id: '1', name: 'Legacy Group', members: [] }])
    )

    const groups = await repository.findAll()
    expect(groups).toHaveLength(1)
    expect(groups[0].slug).toBe('legacy-group')
  })

  it('should find legacy group by slug', async () => {
    // Manually insert legacy data
    localStorage.setItem(
      'monster-high-amigas',
      JSON.stringify([{ id: '1', name: 'Another Legacy', members: [] }])
    )

    const found = await repository.findBySlug('another-legacy')
    expect(found?.name).toBe('Another Legacy')
  })

  it('should delete a group', async () => {
    const group = createFriendGroup({ id: '1', name: 'Vampiras' })
    await repository.save(group)

    await repository.delete('1')
    const groups = await repository.findAll()

    expect(groups).toHaveLength(0)
  })
})
