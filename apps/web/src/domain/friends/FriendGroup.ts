import { generateSlug } from '../../utils/slugUtils'

export class FriendGroup {
  public readonly id: string
  public readonly name: string
  public readonly slug: string
  private _members: string[]

  constructor(id: string, name: string, slug: string, members: string[]) {
    this.id = id
    this.name = name
    this.slug = slug
    this._members = members
  }

  get members(): string[] {
    return this._members
  }

  static fromPrimitives(data: {
    id: string
    name: string
    slug: string
    members?: string[]
  }): FriendGroup {
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

  static create(props: {
    id: string
    name: string
    slug?: string
    members?: string[]
  }): FriendGroup {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Group name cannot be empty')
    }
    return new FriendGroup(
      props.id,
      props.name,
      props.slug ?? generateSlug(props.name),
      props.members ?? []
    )
  }
}
