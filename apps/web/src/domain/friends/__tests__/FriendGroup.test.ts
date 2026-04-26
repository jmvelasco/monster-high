import { describe, expect, it } from 'vitest'
import { createFriendGroup } from '../FriendGroup'

describe('FriendGroup Domain Entity', () => {
  it('should create a valid friend group with id, name and empty members', () => {
    const groupData = {
      id: '123',
      name: 'Vampiras',
    }

    const group = createFriendGroup(groupData)

    expect(group.id).toBe('123')
    expect(group.name).toBe('Vampiras')
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
