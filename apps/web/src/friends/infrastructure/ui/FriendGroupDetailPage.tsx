import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Character } from '../../../characters/domain/Character'
import { CharacterCard } from '../../../characters/infrastructure/ui/CharacterCard/CharacterCard'
import { ConfirmDialog } from '../../../shared/infrastructure/ui/ConfirmDialog/ConfirmDialog'
import { useCharactersQuery } from '../../../characters/infrastructure/store/Character.queries'
import { Factory } from '../../../shared/infrastructure/Factory'
import { AppProviders } from '../../../shared/infrastructure/ui/AppProviders'
import { generateSlug } from '../../../shared/domain/slugUtils'
import { useFriendGroupsQuery } from '../store/FriendGroup.queries'
import { useFriendGroupMutations } from '../store/FriendGroup.mutations'
import styles from './FriendGroupDetailPage.module.css'

interface PageState {
  isConfirmOpen: boolean
  characterToRemove: Character | null
}

export function FriendGroupDetailWiredPage() {
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
      <FriendGroupDetailPage />
    </AppProviders>
  )
}

export function FriendGroupDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const friendGroupsQuery = useFriendGroupsQuery()
  const friendGroupMutations = useFriendGroupMutations()
  const charactersQuery = useCharactersQuery()

  const [state, setState] = useState<PageState>({
    isConfirmOpen: false,
    characterToRemove: null,
  })

  if (friendGroupsQuery.isLoading || charactersQuery.isLoading) {
    return <div className={styles.loading}>Cargando…</div>
  }

  if (!slug) {
    return (
      <div className={styles.notFound}>
        <h2>Grupo no encontrado</h2>
        <button onClick={() => navigate('/friends')} className={styles.backButton}>
          Volver a Mis Amigas
        </button>
      </div>
    )
  }

  const groupResult = friendGroupsQuery.findBySlug(slug)

  if (groupResult.isNone()) {
    return (
      <div className={styles.notFound}>
        <h2>Grupo no encontrado</h2>
        <button onClick={() => navigate('/friends')} className={styles.backButton}>
          Volver a Mis Amigas
        </button>
      </div>
    )
  }

  const group = groupResult.getOrThrow()

  async function handleDeleteGroup() {
    await friendGroupMutations.deleteGroup.mutateAsync(group.id)
    navigate('/friends')
  }

  async function handleRemoveCharacter() {
    if (!state.characterToRemove) return
    const charSlug = generateSlug(state.characterToRemove.name)
    await friendGroupMutations.removeMember.mutateAsync({ slug: charSlug, groupId: group.id })
    setState(prev => ({ ...prev, characterToRemove: null }))
  }

  const groupCharacters = charactersQuery
    .characters()
    .filter(char => group.members.includes(generateSlug(char.name)))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{group.name}</h1>
          <p className={styles.memberCount}>
            {group.members.length} {group.members.length === 1 ? 'amiga' : 'amigas'}
          </p>
        </div>
        <button
          onClick={() => setState(prev => ({ ...prev, isConfirmOpen: true }))}
          className={styles.deleteButton}
        >
          Eliminar grupo
        </button>
      </header>

      <div className={styles.grid}>
        {groupCharacters.length === 0 ? (
          <p className={styles.emptyMessage}>Este grupo no tiene amigas todavía.</p>
        ) : (
          groupCharacters.map(character => (
            <CharacterCard key={character.name} character={character} variant="favorite">
              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setState(prev => ({ ...prev, characterToRemove: character }))
                }}
                className={styles.removeMemberButton}
                aria-label={`Quitar a ${character.name} del grupo`}
              >
                Quitar del grupo
              </button>
            </CharacterCard>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={state.isConfirmOpen}
        title="Eliminar grupo"
        message={`¿Estás segura de que quieres eliminar el grupo “${group.name}”? Esta acción no se puede deshacer y los personajes perderán esta etiqueta.`}
        confirmText="Eliminar grupo"
        onConfirm={handleDeleteGroup}
        onCancel={() => setState(prev => ({ ...prev, isConfirmOpen: false }))}
      />

      <ConfirmDialog
        isOpen={!!state.characterToRemove}
        title="Quitar amiga"
        message={`¿Estás segura de que quieres quitar a ${state.characterToRemove?.name} del grupo “${group.name}”?`}
        confirmText="Quitar del grupo"
        onConfirm={handleRemoveCharacter}
        onCancel={() => setState(prev => ({ ...prev, characterToRemove: null }))}
      />
    </div>
  )
}
