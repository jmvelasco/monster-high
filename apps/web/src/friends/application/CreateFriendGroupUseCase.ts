import { FriendGroup } from '../domain/FriendGroup'
import type { FriendGroupRepository } from '../domain/FriendGroupRepository'

export class CreateFriendGroupUseCase {
  constructor(private readonly repository: FriendGroupRepository) {}

  async execute(name: string): Promise<void> {
    const group = FriendGroup.create({ id: crypto.randomUUID(), name })
    await this.repository.save(group)
  }
}
