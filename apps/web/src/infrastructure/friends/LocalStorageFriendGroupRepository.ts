import type { FriendGroup } from '../../domain/friends/FriendGroup'
import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

import { generateSlug } from '../../utils/slugUtils'

const STORAGE_KEY = 'monster-high-amigas'

export class LocalStorageFriendGroupRepository implements FriendGroupRepository {
  async findAll(): Promise<FriendGroup[]> {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored) as any[]
      return parsed.map(group => ({
        ...group,
        slug: group.slug || generateSlug(group.name),
      }))
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  }

  async delete(id: string): Promise<void> {
    const groups = await this.findAll()
    const filtered = groups.filter(g => g.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
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
