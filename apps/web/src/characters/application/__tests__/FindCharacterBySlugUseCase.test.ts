import type { Character } from '../../domain/entities/Character'
import { InMemoryCharacterRepository } from '../../tests/fakes/InMemoryCharacterRepository'
import { FindCharacterBySlugUseCase } from '../FindCharacterBySlugUseCase'

describe('The FindCharacterBySlug use case', () => {
  it('finds a character matching the given slug', async () => {
    const characters: Character[] = [
      {
        name: 'Draculaura',
        url: 'https://example.com/draculaura',
        technicalInfo: {},
        sections: {},
      },
    ]
    const repository = new InMemoryCharacterRepository(characters)
    const useCase = new FindCharacterBySlugUseCase(repository)

    const result = await useCase.execute('draculaura')

    expect(result).toEqual(characters[0])
  })

  it('does not find a character when slug has no match', async () => {
    const repository = new InMemoryCharacterRepository()
    const useCase = new FindCharacterBySlugUseCase(repository)

    const result = await useCase.execute('non-existent')

    expect(result).toBeNull()
  })
})
