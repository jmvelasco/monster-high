import { describe, expect, it } from 'vitest'
import { createFriendGroup } from '../FriendGroup'

describe('FriendGroup Domain Entity', () => {
  it('should create a valid friend group with id, name, slug, and empty members', () => {
    const groupData = {
      id: '123',
      name: 'Mis Favs',
    }

    const group = createFriendGroup(groupData)

    expect(group.id).toBe('123')
    expect(group.name).toBe('Mis Favs')
    expect(group.slug).toBe('mis-favs')
    expect(group.members).toEqual([])
  })

  it('should create a friend group with initial members', () => {
    const groupData = {
      id: '456',
      name: 'Monstruos',
      members: ['draculaura', 'clawdeen'],
    }

    const group = createFriendGroup(groupData)

    expect(group.members).toContain('draculaura')
    expect(group.members).toHaveLength(2)
  })

  it('should use provided slug if available instead of generating a new one', () => {
    const groupData = {
      id: '789',
      name: 'New Name',
      slug: 'old-name',
    }

    const group = createFriendGroup(groupData)

    expect(group.slug).toBe('old-name')
  })

  it('should throw an error if the name is empty', () => {
    const groupData = {
      id: '123',
      name: '',
    }

    expect(() => createFriendGroup(groupData)).toThrow('Group name cannot be empty')
  })

  it('should throw an error if the name only contains whitespace', () => {
    const groupData = {
      id: '123',
      name: '   ',
    }

    expect(() => createFriendGroup(groupData)).toThrow('Group name cannot be empty')
  })
})
