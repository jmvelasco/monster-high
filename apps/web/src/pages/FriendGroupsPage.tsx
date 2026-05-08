import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFriendGroups } from '../hooks/useFriendGroups'
import styles from './FriendGroupsPage.module.css'

export function FriendGroupsPage() {
  const { groups, loadGroups, createGroup } = useFriendGroups()
  const [newGroupName, setNewGroupName] = useState('')

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  async function handleCreateGroup() {
    if (!newGroupName.trim()) return
    await createGroup(newGroupName.trim())
    setNewGroupName('')
  }

  return (
    <div className={styles.friendsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Amigas</h1>
      </div>

      <div className={styles.createForm}>
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="Nombre del grupo"
          className={styles.input}
        />
        <button onClick={handleCreateGroup} className={styles.createButton}>
          Crear grupo
        </button>
      </div>

      {groups.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💜</div>
          <p className={styles.emptyMessage}>No tienes grupos de amigas aún</p>
          <p className={styles.emptySubMessage}>
            Crea tu primer grupo y empieza a organizar tus personajes favoritos
          </p>
        </div>
      ) : (
        <div className={styles.groupsGrid}>
          {groups.map(group => (
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
