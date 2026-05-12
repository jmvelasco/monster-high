import type { Character } from '../domain/Character'
import type { CharacterRepository } from '../domain/CharacterRepository'

export class FindCharacterBySlugUseCase {
  private readonly repository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.repository = repository
  }

  async execute(slug: string): Promise<Character | null> {
    return this.repository.findBySlug(slug)
  }
}
