import type { Character } from '../domain/Character'
import type { CharacterRepository } from '../domain/CharacterRepository'

export class ListCharactersUseCase {
  private readonly repository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.repository = repository
  }

  async execute(): Promise<Character[]> {
    return this.repository.findAll()
  }
}
