import type { Character } from '../domain/entities/Character'
import type { CharacterRepository } from '../domain/ports/CharacterRepository'

export class FindCharacterBySlugUseCase {
  private readonly repository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.repository = repository
  }

  async execute(slug: string): Promise<Character | null> {
    return this.repository.findBySlug(slug)
  }
}
