import type { FriendGroup } from '../../domain/friends/FriendGroup'
import type { FriendGroupRepository } from '../../domain/friends/FriendGroupRepository'

export class FindFriendGroupBySlugUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(slug: string): Promise<FriendGroup | null> {
    return this.repository.findBySlug(slug)
  }
}
