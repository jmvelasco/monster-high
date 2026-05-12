import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

export class CreateFriendGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(name: string): Promise<void> {}
}
