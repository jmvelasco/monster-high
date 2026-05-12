import type { FriendGroup } from '../domain/FriendGroup'
import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class ListFriendGroupsUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(): Promise<FriendGroup[]> {
    return this.repository.findAll()
  }
}
