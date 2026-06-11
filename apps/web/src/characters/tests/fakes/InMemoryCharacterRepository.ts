import { generateSlug } from '../../../shared/domain/slugUtils'
import type { Character } from '../../domain/entities/Character'
import type { CharacterRepository } from '../../domain/ports/CharacterRepository'

export class InMemoryCharacterRepository implements CharacterRepository {
  private readonly characters: Character[]

  constructor(characters: Character[] = []) {
    this.characters = characters
  }

  async findAll(): Promise<Character[]> {
    return this.characters
  }

  async findBySlug(slug: string): Promise<Character | null> {
    return this.characters.find(character => generateSlug(character.name) === slug) ?? null
  }
}
