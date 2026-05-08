import { generateSlug } from '../../utils/slugUtils'

export class FriendGroup {
  private _members: string[]

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    members: string[]
  ) {
    this._members = members
  }

  get members(): string[] {
    return this._members
  }

  static fromPrimitives(data: { id: string; name: string; slug: string; members?: string[] }): FriendGroup {
    return new FriendGroup(data.id, data.name, data.slug, data.members ?? [])
  }

  addMember(slug: string): void {
    if (!this._members.includes(slug)) {
      this._members = [...this._members, slug]
    }
  }

  removeMember(slug: string): void {
    this._members = this._members.filter(member => member !== slug)
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
