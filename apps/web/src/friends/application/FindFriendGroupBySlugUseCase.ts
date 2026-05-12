import type { FriendGroup } from '../domain/FriendGroup'
import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class FindFriendGroupBySlugUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(slug: string): Promise<FriendGroup | null> {
    return this.repository.findBySlug(slug)
  }
}
