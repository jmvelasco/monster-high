import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Factory } from '../../../../shared/infrastructure/Factory'
import { AppProviders } from '../../../../shared/infrastructure/ui/AppProviders'
import { useFriendGroupMutations } from '../../store/FriendGroup.mutations'
import { useFriendGroupsQuery } from '../../store/FriendGroup.queries'
import styles from './FriendGroupsPage.module.css'

export function FriendGroupsWiredPage() {
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
      <FriendGroupsPage />
    </AppProviders>
  )
}

export function FriendGroupsPage() {
  const friendGroupsQuery = useFriendGroupsQuery()
  const friendGroupMutations = useFriendGroupMutations()
  const [newGroupName, setNewGroupName] = useState('')

  async function handleCreateGroup(event: React.SubmitEvent) {
    event.preventDefault()
    if (!newGroupName.trim()) return
    await friendGroupMutations.create.mutateAsync(newGroupName.trim())
    setNewGroupName('')
  }

  if (friendGroupsQuery.isLoading) {
    return <div>Cargando…</div>
  }

  return (
    <div className={styles.friendsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Amigas</h1>
      </div>

      <form className={styles.createForm} onSubmit={handleCreateGroup}>
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="Nombre del grupo"
          aria-label="Nombre del grupo"
          className={styles.input}
        />
        <button type="submit" className={styles.createButton}>
          Crear grupo
        </button>
      </form>

      {!friendGroupsQuery.hasGroups() ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            💜
          </div>
          <p className={styles.emptyMessage}>No tienes grupos de amigas aún</p>
          <p className={styles.emptySubMessage}>
            Crea tu primer grupo y empieza a organizar tus personajes favoritos
          </p>
        </div>
      ) : (
        <div className={styles.groupsGrid}>
          {friendGroupsQuery.groups().map(group => (
            <Link key={group.id} to={`/friends/${group.slug}`} className={styles.groupCard}>
              <div className={styles.groupHeader}>
                <h2 className={styles.groupName}>{group.name}</h2>
              </div>
              <p className={styles.memberCount}>
                {group.members.length} {group.members.length === 1 ? 'amiga' : 'amigas'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
