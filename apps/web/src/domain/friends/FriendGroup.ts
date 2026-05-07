import { generateSlug } from '../../utils/slugUtils'

export interface FriendGroup {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly members: string[]
}

export interface CreateFriendGroupProps {
  id: string
  name: string
  slug?: string
  members?: string[]
}

export function createFriendGroup({ id, name, slug, members = [] }: CreateFriendGroupProps): FriendGroup {
  if (!name || name.trim().length === 0) {
    throw new Error('Group name cannot be empty')
  }
  return {
    id,
    name,
    slug: slug ?? generateSlug(name),
    members,
  }
}
