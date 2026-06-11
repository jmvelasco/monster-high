import { Factory } from '../../../shared/infrastructure/Factory'
import { AppProviders } from '../../../shared/infrastructure/ui/AppProviders'
import { useCharacterSearch } from '../store/Character.search'
import { SearchInput } from './SearchInput/SearchInput'
import { CharacterGrid } from './CharacterGrid/CharacterGrid'

export function CharacterListWiredPage() {
  return (
    <AppProviders
      characterUseCases={{
        list: Factory.createListCharactersUseCase(),
        findBySlug: Factory.createFindCharacterBySlugUseCase(),
      }}
      friendGroupUseCases={{
        list: Factory.createListFriendGroupsUseCase(),
        findBySlug: Factory.createFindFriendGroupBySlugUseCase(),
        create: Factory.createCreateFriendGroupUseCase(),
        addMember: Factory.createAddMemberToGroupUseCase(),
        removeMember: Factory.createRemoveMemberFromGroupUseCase(),
        deleteGroup: Factory.createDeleteFriendGroupUseCase(),
      }}
    >
      <CharacterListPage />
    </AppProviders>
  )
}

export function CharacterListPage() {
  const { isLoading, errorMessage, searchTerm, setSearchTerm, resetSearch, filteredCharacters } =
    useCharacterSearch()

  if (isLoading) {
    return <div>Cargando personajes...</div>
  }

  if (errorMessage()) {
    return <div>Error al cargar personajes</div>
  }

  return (
    <>
      <h1 className="visually-hidden">Personajes</h1>
      <SearchInput value={searchTerm} onChange={setSearchTerm} onReset={resetSearch} />
      <CharacterGrid
        characters={filteredCharacters()}
        emptyMessage={searchTerm !== '' ? 'No se encontraron personajes' : undefined}
      />
    </>
  )
}
