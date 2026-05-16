import type { FriendGroupRepository } from '../domain/ports/FriendGroupRepository'

export class DeleteFriendGroupUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(groupId: string): Promise<void> {
    return this.repository.delete(groupId)
  }
}
