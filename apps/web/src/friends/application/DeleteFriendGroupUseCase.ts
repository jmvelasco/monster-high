import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

export class DeleteFriendGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(groupId: string): Promise<void> {}
}
