import { FriendGroup } from '../../domain/FriendGroup'
import type { FriendGroupRepository } from '../../domain/FriendGroupRepository'

export class InMemoryFriendGroupRepository implements FriendGroupRepository {
  private groups: FriendGroup[] = []

  async findAll(): Promise<FriendGroup[]> {
    return this.groups
  }

  async save(group: FriendGroup): Promise<void> {
    const index = this.groups.findIndex(g => g.id === group.id)
    if (index >= 0) {
      this.groups[index] = group
    } else {
      this.groups = [...this.groups, group]
    }
  }

  async delete(id: string): Promise<void> {
    this.groups = this.groups.filter(g => g.id !== id)
  }

  async findById(id: string): Promise<FriendGroup | null> {
    return this.groups.find(g => g.id === id) ?? null
  }

  async findBySlug(slug: string): Promise<FriendGroup | null> {
    return this.groups.find(g => g.slug === slug) ?? null
  }
}
