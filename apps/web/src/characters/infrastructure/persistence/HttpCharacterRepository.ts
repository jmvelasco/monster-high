import { generateSlug } from '../../../shared/domain/slugUtils'
import type { Character } from '../../domain/entities/Character'
import type { CharacterRepository } from '../../domain/ports/CharacterRepository'

export class HttpCharacterRepository implements CharacterRepository {
  async findAll(): Promise<Character[]> {
    const response = await fetch('/api/characters.json')
    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }
    return response.json()
  }

  async findBySlug(slug: string): Promise<Character | null> {
    const characters = await this.findAll()
    return characters.find(character => generateSlug(character.name) === slug) ?? null
  }
}
