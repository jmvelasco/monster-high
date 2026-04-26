import { useState } from 'react'
import type { FriendGroup } from '../../domain/friends/FriendGroup'
import styles from './GroupSelector.module.css'

interface GroupSelectorProps {
  groups: FriendGroup[]
  characterSlug: string
  onAddToGroup: (slug: string, groupId: string) => void
  onCreateGroup: (name: string) => void
}

export function GroupSelector({
  groups,
  characterSlug,
  onAddToGroup,
  onCreateGroup,
}: GroupSelectorProps) {
  const [newGroupName, setNewGroupName] = useState('')

  function handleCreate() {
    if (!newGroupName.trim()) return
    onCreateGroup(newGroupName.trim())
    setNewGroupName('')
  }

  return (
    <div className={styles.selector}>
      <h3 className={styles.title}>Añadir a grupo de amigas</h3>
      <div className={styles.groupList}>
        {groups.map(group => {
          const isInGroup = group.members.includes(characterSlug)
          return (
            <button
              key={group.id}
              className={`${styles.groupButton} ${isInGroup ? styles.inGroup : ''}`}
              onClick={() => onAddToGroup(characterSlug, group.id)}
              aria-pressed={isInGroup}
            >
              {group.name}
            </button>
          )
        })}
      </div>
      <div className={styles.createRow}>
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="Nuevo grupo"
          className={styles.input}
        />
        <button onClick={handleCreate} className={styles.createButton}>
          Crear
        </button>
      </div>
    </div>
  )
}
