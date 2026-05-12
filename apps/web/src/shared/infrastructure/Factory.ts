import { ListCharactersUseCase } from '../../characters/application/ListCharactersUseCase'
import { FindCharacterBySlugUseCase } from '../../characters/application/FindCharacterBySlugUseCase'
import { HttpCharacterRepository } from '../../characters/infrastructure/api/HttpCharacterRepository'

export class Factory {
  static createListCharactersUseCase(): ListCharactersUseCase {
    const repository = new HttpCharacterRepository()
    return new ListCharactersUseCase(repository)
  }

  static createFindCharacterBySlugUseCase(): FindCharacterBySlugUseCase {
    const repository = new HttpCharacterRepository()
    return new FindCharacterBySlugUseCase(repository)
  }
}
