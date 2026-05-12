import type { FriendGroup } from '../../domain/friends/FriendGroup'
import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

export class ListFriendGroupsUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(): Promise<FriendGroup[]> {
    return []
  }
}
