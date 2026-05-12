import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class AddMemberToGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(slug: string, groupId: string): Promise<void> {
    const group = await this.repository.findById(groupId)
    if (!group) return

    group.addMember(slug)
    await this.repository.save(group)
  }
}
