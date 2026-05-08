import { generateSlug } from '../../utils/slugUtils'

export class FriendGroup {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly members: string[]
  ) {}

  static fromPrimitives(data: { id: string; name: string; slug: string; members?: string[] }): FriendGroup {
    return new FriendGroup(data.id, data.name, data.slug, data.members ?? [])
  }
}

export interface CreateFriendGroupProps {
  id: string
  name: string
  slug?: string
  members?: string[]
}

export function createFriendGroup({
  id,
  name,
  slug,
  members = [],
}: CreateFriendGroupProps): FriendGroup {
  if (!name || name.trim().length === 0) {
    throw new Error('Group name cannot be empty')
  }
  return new FriendGroup(
    id,
    name,
    slug ?? generateSlug(name),
    members
  )
}
