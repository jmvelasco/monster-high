import { FriendGroup } from '../../domain/friends/FriendGroup'
import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

import { generateSlug } from '../../utils/slugUtils'

const STORAGE_KEY = 'monster-high-amigas'

interface StoredFriendGroup {
  id: string
  name: string
  slug?: string
  members?: string[]
  _members?: string[]
}

export class LocalStorageFriendGroupRepository implements FriendGroupRepository {
  async findAll(): Promise<FriendGroup[]> {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored) as StoredFriendGroup[]
      return parsed.map(group => {
        // Handle legacy data where members might be _members or missing
        const members = group.members ?? group._members ?? []
        return FriendGroup.fromPrimitives({
          id: group.id,
          name: group.name,
          slug: group.slug || generateSlug(group.name),
          members,
        })
      })
    } catch {
      return []
    }
  }

  async save(group: FriendGroup): Promise<void> {
    const groups = await this.findAll()
    const index = groups.findIndex(g => g.id === group.id)

    if (index >= 0) {
      groups[index] = group
    } else {
      groups.push(group)
    }

    const primitiveGroups = groups.map(g => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      members: g.members
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(primitiveGroups))
  }

  async delete(id: string): Promise<void> {
    const groups = await this.findAll()
    const filtered = groups.filter(g => g.id !== id)
    
    const primitiveGroups = filtered.map(g => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      members: g.members
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(primitiveGroups))
  }

  async findById(id: string): Promise<FriendGroup | null> {
    const groups = await this.findAll()
    return groups.find(g => g.id === id) || null
  }

  async findBySlug(slug: string): Promise<FriendGroup | null> {
    const groups = await this.findAll()
    return groups.find(g => g.slug === slug) || null
  }
}
