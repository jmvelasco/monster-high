import type { FriendGroup } from '../domain/entities/FriendGroup'
import type { FriendGroupRepository } from '../domain/ports/FriendGroupRepository'

export class ListFriendGroupsUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(): Promise<FriendGroup[]> {
    return this.repository.findAll()
  }
}
