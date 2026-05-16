import type { Character } from '../entities/Character'

export interface CharacterRepository {
  findAll(): Promise<Character[]>
  findBySlug(slug: string): Promise<Character | null>
}
