import { generateSlug } from '../../utils/slugUtils'
import type { FlatFriendGroup } from './FriendGroupRepository'

export class FriendGroup {
  public readonly id: string
  public readonly name: string
  public readonly slug: string
  private memberList: string[]

  private constructor(id: string, name: string, slug: string, members: string[]) {
    this.id = id
    this.name = name
    this.slug = slug
    this.memberList = members
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

  static fromPrimitives(data: {
    id: string
    name: string
    slug: string
    members?: string[]
  }): FriendGroup {
    return new FriendGroup(data.id, data.name, data.slug, data.members ?? [])
  }

  toFlatObject(): FlatFriendGroup {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      members: this.memberList,
    }
  }

  get members(): string[] {
    return this.memberList
  }

  addMember(slug: string): void {
    if (!this.memberList.includes(slug)) {
      this.memberList = [...this.memberList, slug]
    }
  }

  removeMember(slug: string): void {
    this.memberList = this.memberList.filter(member => member !== slug)
  }
}
