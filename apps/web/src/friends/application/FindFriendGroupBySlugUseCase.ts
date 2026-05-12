import type { FriendGroup } from '../domain/FriendGroup'
import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class FindFriendGroupBySlugUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(slug: string): Promise<FriendGroup | null> {
    return this.repository.findBySlug(slug)
  }
}
