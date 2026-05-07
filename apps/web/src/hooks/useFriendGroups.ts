import { useState } from 'react'
import { createFriendGroup, type FriendGroup } from '../domain/friends/FriendGroup'
import { LocalStorageFriendGroupRepository } from '../infrastructure/friends/LocalStorageFriendGroupRepository'

const repository = new LocalStorageFriendGroupRepository()

export function useFriendGroups() {
  const [groups, setGroups] = useState<FriendGroup[]>([])

  async function loadGroups() {
    const all = await repository.findAll()
    setGroups(all)
  }

  async function createGroup(name: string) {
    const group = createFriendGroup({ id: crypto.randomUUID(), name })
    await repository.save(group)
    await loadGroups()
  }

  async function addCharacterToGroup(slug: string, groupId: string) {
    const group = await repository.findById(groupId)
    if (!group) return
    if (group.members.includes(slug)) return

    const updated = { ...group, members: [...group.members, slug] }
    await repository.save(updated)
    await loadGroups()
  }

  async function removeGroup(groupId: string) {
    await repository.delete(groupId)
    await loadGroups()
  }

  async function getGroupBySlug(slug: string) {
    return await repository.findBySlug(slug)
  }

  return { groups, loadGroups, createGroup, addCharacterToGroup, removeGroup, getGroupBySlug }
}
