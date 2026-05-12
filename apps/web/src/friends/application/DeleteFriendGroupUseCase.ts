import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class DeleteFriendGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(groupId: string): Promise<void> {
    return this.repository.delete(groupId)
  }
}
