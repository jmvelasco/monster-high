import { Factory } from '../../../shared/infrastructure/Factory'
import { AppProviders } from '../../../shared/infrastructure/ui/AppProviders'
import { useCharactersQuery } from '../store/Character.queries'
import { CharacterGrid } from './CharacterGrid/CharacterGrid'

export function CharacterListWiredPage() {
  return (
    <AppProviders
      characterUseCases={{
        list: Factory.createListCharactersUseCase(),
        findBySlug: Factory.createFindCharacterBySlugUseCase(),
      }}
    >
      <CharacterListPage />
    </AppProviders>
  )
}

export function CharacterListPage() {
  const charactersQuery = useCharactersQuery()

  if (charactersQuery.isLoading) {
    return <div>Cargando personajes...</div>
  }

  if (charactersQuery.errorMessage()) {
    return <div>Error al cargar personajes</div>
  }

  return <CharacterGrid characters={charactersQuery.characters()} />
}
