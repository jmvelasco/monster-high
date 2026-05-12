import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

export class AddMemberToGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(slug: string, groupId: string): Promise<void> {}
}
