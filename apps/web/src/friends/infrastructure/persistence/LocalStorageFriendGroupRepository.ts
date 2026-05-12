import { FriendGroup } from '../../domain/FriendGroup'
import type {
  FlatFriendGroup,
  FriendGroupRepository,
} from '../../domain/FriendGroupRepository'
import { generateSlug } from '../../../shared/domain/slugUtils'

const STORAGE_KEY = 'monster-high-amigas'

export class LocalStorageFriendGroupRepository implements FriendGroupRepository {
  async findAll(): Promise<FriendGroup[]> {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored) as FlatFriendGroup[]
      return parsed.map(group => {
        const members = group.members ?? []
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
    const flatGroups = groups.map(g => g.toFlatObject())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flatGroups))
  }

  async delete(id: string): Promise<void> {
    const groups = await this.findAll()
    const filtered = groups.filter(g => g.id !== id)
    const flatGroups = filtered.map(g => g.toFlatObject())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flatGroups))
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
