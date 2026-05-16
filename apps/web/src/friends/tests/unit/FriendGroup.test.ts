import { describe, expect, it } from 'vitest'
import { FriendGroup } from '../../domain/entities/FriendGroup'

describe('FriendGroup Domain Entity', () => {
  it('should create a valid friend group with id, name, slug, and empty members', () => {
    const groupData = {
      id: '123',
      name: 'Mis Favs',
    }

    const group = FriendGroup.create(groupData)

    expect(group.id).toBe('123')
    expect(group.name).toBe('Mis Favs')
    expect(group.slug).toBe('mis-favs')
    expect(group.members).toEqual([])
    expect(group).toBeInstanceOf(FriendGroup)
  })

  it('should create a friend group with initial members', () => {
    const groupData = {
      id: '456',
      name: 'Monstruos',
      members: ['draculaura', 'clawdeen'],
    }

    const group = FriendGroup.create(groupData)

    expect(group.members).toContain('draculaura')
    expect(group.members).toHaveLength(2)
  })

  it('should use provided slug if available instead of generating a new one', () => {
    const groupData = {
      id: '789',
      name: 'New Name',
      slug: 'old-name',
    }

    const group = FriendGroup.create(groupData)

    expect(group.slug).toBe('old-name')
  })

  it('should throw an error if the name is empty', () => {
    const groupData = {
      id: '123',
      name: '',
    }

    expect(() => FriendGroup.create(groupData)).toThrow('Group name cannot be empty')
  })

  it('should throw an error if the name only contains whitespace', () => {
    const groupData = {
      id: '123',
      name: '   ',
    }

    expect(() => FriendGroup.create(groupData)).toThrow('Group name cannot be empty')
  })

  describe('fromPrimitives', () => {
    it('should rehydrate a FriendGroup from plain data', () => {
      const data = {
        id: '999',
        name: 'Restored',
        slug: 'restored',
        members: ['ghoulia'],
      }

      const group = FriendGroup.fromPrimitives(data)

      expect(group).toBeInstanceOf(FriendGroup)
      expect(group.id).toBe('999')
      expect(group.name).toBe('Restored')
      expect(group.slug).toBe('restored')
      expect(group.members).toEqual(['ghoulia'])
    })

    it('should fallback to empty array if members are missing', () => {
      const data = {
        id: '999',
        name: 'Restored',
        slug: 'restored',
      }

      const group = FriendGroup.fromPrimitives(data)

      expect(group.members).toEqual([])
    })
  })

  describe('addMember', () => {
    it('should add a new member to the group', () => {
      const group = FriendGroup.fromPrimitives({ id: '1', name: 'Ghouls', slug: 'ghouls' })

      group.addMember('clawdeen')

      expect(group.members).toContain('clawdeen')
      expect(group.members).toHaveLength(1)
    })

    it('should not add a member if they are already in the group', () => {
      const group = FriendGroup.fromPrimitives({
        id: '1',
        name: 'Ghouls',
        slug: 'ghouls',
        members: ['clawdeen'],
      })

      group.addMember('clawdeen')

      expect(group.members).toHaveLength(1)
    })
  })

  describe('removeMember', () => {
    it('should remove an existing member from the group', () => {
      const group = FriendGroup.fromPrimitives({
        id: '1',
        name: 'Ghouls',
        slug: 'ghouls',
        members: ['draculaura', 'clawdeen'],
      })

      group.removeMember('draculaura')

      expect(group.members).not.toContain('draculaura')
      expect(group.members).toContain('clawdeen')
      expect(group.members).toHaveLength(1)
    })

    it('should do nothing if removing a non-existent member', () => {
      const group = FriendGroup.fromPrimitives({
        id: '1',
        name: 'Ghouls',
        slug: 'ghouls',
        members: ['clawdeen'],
      })

      group.removeMember('draculaura')

      expect(group.members).toContain('clawdeen')
      expect(group.members).toHaveLength(1)
    })
  })
})
