import type { Character } from '../domain/entities/Character'

export class FilterCharactersByNameUseCase {
  execute(characters: Character[], query: string): Character[] {
    const trimmed = query.trim()

    if (trimmed === '') {
      return characters
    }

    const lowerQuery = trimmed.toLowerCase()

    return characters.filter((character) =>
      character.name.toLowerCase().includes(lowerQuery)
    )
  }
}
