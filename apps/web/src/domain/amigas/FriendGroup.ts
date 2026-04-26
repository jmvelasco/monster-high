export interface FriendGroup {
  readonly id: string
  readonly name: string
  readonly members: string[]
}

export interface CreateFriendGroupProps {
  id: string
  name: string
  members?: string[]
}

export function createFriendGroup({ id, name, members = [] }: CreateFriendGroupProps): FriendGroup {
  if (!name || name.trim().length === 0) {
    throw new Error('Group name cannot be empty')
  }
  return {
    id,
    name,
    members,
  }
}
