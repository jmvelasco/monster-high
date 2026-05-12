import type { Character } from './Character'

export interface CharacterRepository {
  findAll(): Promise<Character[]>
  findBySlug(slug: string): Promise<Character | null>
}
