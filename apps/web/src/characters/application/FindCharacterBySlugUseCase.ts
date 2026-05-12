import type { Character } from '../domain/Character'
import type { CharacterRepository } from '../domain/CharacterRepository'

export class FindCharacterBySlugUseCase {
  constructor(private readonly repository: CharacterRepository) {}

  async execute(slug: string): Promise<Character | null> {
    return null
  }
}
