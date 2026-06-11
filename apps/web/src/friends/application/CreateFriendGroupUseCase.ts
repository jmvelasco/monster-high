import { FriendGroup } from '../domain/entities/FriendGroup'
import type { FriendGroupRepository } from '../domain/ports/FriendGroupRepository'

export class CreateFriendGroupUseCase {
  private readonly repository: FriendGroupRepository

  constructor(repository: FriendGroupRepository) {
    this.repository = repository
  }

  async execute(name: string): Promise<void> {
    const group = FriendGroup.create({ id: crypto.randomUUID(), name })
    await this.repository.save(group)
  }
}
