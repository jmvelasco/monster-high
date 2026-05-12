import type { Character } from '../../domain/Character'
import type { CharacterRepository } from '../../domain/CharacterRepository'
import { generateSlug } from '../../../shared/domain/slugUtils'

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
