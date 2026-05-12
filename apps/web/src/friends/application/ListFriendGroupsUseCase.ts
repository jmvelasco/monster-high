import type { FriendGroup } from '../domain/FriendGroup'
import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class ListFriendGroupsUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(): Promise<FriendGroup[]> {
    return this.repository.findAll()
  }
}
