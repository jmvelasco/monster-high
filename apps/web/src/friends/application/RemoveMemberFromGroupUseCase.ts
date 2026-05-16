import type { FriendGroupRepository } from '../domain/ports/FriendGroupRepository'

export class RemoveMemberFromGroupUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(slug: string, groupId: string): Promise<void> {
    const group = await this.repository.findById(groupId)
    if (!group) return

    group.removeMember(slug)
    await this.repository.save(group)
  }
}
