import { useParams } from 'react-router-dom'
import { Factory } from '../../../shared/infrastructure/Factory'
import { AppProviders } from '../../../shared/infrastructure/ui/AppProviders'
import { useCharactersQuery } from '../store/Character.queries'
import { CharacterDetail } from './CharacterDetail/CharacterDetail'

export function CharacterDetailWiredPage() {
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
      <CharacterDetailPage />
    </AppProviders>
  )
}

export function CharacterDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const charactersQuery = useCharactersQuery()

  if (charactersQuery.isLoading) {
    return <div>Cargando…</div>
  }

  if (charactersQuery.errorMessage()) {
    return <div>Error al cargar personaje</div>
  }

  return charactersQuery.findBySlug(slug ?? '').fold(
    () => <div>Personaje no encontrado</div>,
    character => <CharacterDetail key={slug} character={character} />
  )
}
