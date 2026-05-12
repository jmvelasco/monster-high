import { ListCharactersUseCase } from '../ListCharactersUseCase'
import { InMemoryCharacterRepository } from '../../infrastructure/InMemoryCharacterRepository'
import type { Character } from '../../domain/Character'

describe('The ListCharacters use case', () => {
  it('lists all available characters', async () => {
    const characters: Character[] = [
      {
        name: 'Draculaura',
        url: 'https://example.com/draculaura',
        technicalInfo: {},
        sections: {},
      },
    ]
    const repository = new InMemoryCharacterRepository(characters)
    const useCase = new ListCharactersUseCase(repository)

    const result = await useCase.execute()

    expect(result).toEqual(characters)
  })

  it('lists no characters when repository is empty', async () => {
    const repository = new InMemoryCharacterRepository()
    const useCase = new ListCharactersUseCase(repository)

    const result = await useCase.execute()

    expect(result).toEqual([])
  })
})
