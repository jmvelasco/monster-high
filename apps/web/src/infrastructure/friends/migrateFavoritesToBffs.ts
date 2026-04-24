import type { FriendGroup } from '../../domain/friends/FriendGroup'
import { createFriendGroup } from '../../domain/friends/FriendGroup'
import { LocalStorageFriendGroupRepository } from './LocalStorageFriendGroupRepository'

const oldFavoritesKey = 'monster-high-favorites'

export async function migrateFavoritesToBffs(): Promise<FriendGroup | null> {
  const stored = localStorage.getItem(oldFavoritesKey)
  if (!stored) return null

  const members: string[] = JSON.parse(stored)
  if (members.length === 0) return null

  const group = createFriendGroup({ id: crypto.randomUUID(), name: 'BFFs', members })
  const repository = new LocalStorageFriendGroupRepository()
  await repository.save(group)
  localStorage.removeItem(oldFavoritesKey)
  return group
}
