import type { FriendGroup } from '../entities/FriendGroup'

export interface FriendGroupRepository {
  findAll(): Promise<FriendGroup[]>
  save(group: FriendGroup): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<FriendGroup | null>
  findBySlug(slug: string): Promise<FriendGroup | null>
}

export interface FlatFriendGroup {
  id: string
  name: string
  slug?: string
  members?: string[]
}
