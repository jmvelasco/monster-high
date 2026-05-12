import type { Character } from '../../domain/Character'
import type { CharacterRepository } from '../../domain/CharacterRepository'
import { generateSlug } from '../../shared/domain/slugUtils'

export class InMemoryCharacterRepository implements CharacterRepository {
  constructor(private readonly characters: Character[] = []) {}

  async findAll(): Promise<Character[]> {
    return this.characters
  }

  async findBySlug(slug: string): Promise<Character | null> {
    return this.characters.find(character => generateSlug(character.name) === slug) ?? null
  }
}
