import { useCallback, useState } from 'react'
import { FriendGroup } from '../domain/friends/FriendGroup'
import { LocalStorageFriendGroupRepository } from '../infrastructure/friends/LocalStorageFriendGroupRepository'

const repository = new LocalStorageFriendGroupRepository()

export function useFriendGroups() {
  const [groups, setGroups] = useState<FriendGroup[]>([])

  const loadGroups = useCallback(async () => {
    const all = await repository.findAll()
    setGroups(all)
  }, [])

  async function createGroup(name: string) {
    const group = FriendGroup.create({ id: crypto.randomUUID(), name })
    await repository.save(group)
    await loadGroups()
  }

  async function addCharacterToGroup(slug: string, groupId: string) {
    const group = await repository.findById(groupId)
    if (!group) return
    
    group.addMember(slug)
    await repository.save(group)
    await loadGroups()
  }

  async function removeCharacterFromGroup(slug: string, groupId: string) {
    const group = await repository.findById(groupId)
    if (!group) return

    group.removeMember(slug)
    await repository.save(group)
    await loadGroups()
  }

  async function removeGroup(groupId: string) {
    await repository.delete(groupId)
    await loadGroups()
  }

  const getGroupBySlug = useCallback(async (slug: string) => {
    return await repository.findBySlug(slug)
  }, [])

  return { groups, loadGroups, createGroup, addCharacterToGroup, removeGroup, getGroupBySlug, removeCharacterFromGroup }
}
