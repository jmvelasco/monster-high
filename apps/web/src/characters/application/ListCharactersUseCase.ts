import type { Character } from '../domain/entities/Character'
import type { CharacterRepository } from '../domain/ports/CharacterRepository'

export class ListCharactersUseCase {
  private readonly repository: CharacterRepository

  constructor(repository: CharacterRepository) {
    this.repository = repository
  }

  async execute(): Promise<Character[]> {
    return this.repository.findAll()
  }
}
