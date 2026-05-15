import { useState } from 'react'
import type { FriendGroup } from '../../../domain/FriendGroup'
import styles from './GroupSelector.module.css'

interface Props {
  groups: FriendGroup[]
  characterSlug: string
  onAddToGroup: (slug: string, groupId: string) => void
  onCreateGroup: (name: string) => void
}

export function GroupSelector(props: Props) {
  const [newGroupName, setNewGroupName] = useState('')

  function handleCreate(event: React.SubmitEvent) {
    event.preventDefault()
    if (!newGroupName.trim()) return
    props.onCreateGroup(newGroupName.trim())
    setNewGroupName('')
  }

  return (
    <div className={styles.selector}>
      <h3 className={styles.title}>Añadir a grupo de amigas</h3>
      <div className={styles.groupList}>
        {props.groups.map(group => {
          const isInGroup = group.members.includes(props.characterSlug)
          return (
            <button
              key={group.id}
              className={`${styles.groupButton} ${isInGroup ? styles.inGroup : ''}`}
              onClick={() => props.onAddToGroup(props.characterSlug, group.id)}
              aria-pressed={isInGroup}
            >
              {group.name}
            </button>
          )
        })}
      </div>
      <form className={styles.createRow} onSubmit={handleCreate}>
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="Nuevo grupo"
          aria-label="Nuevo grupo"
          className={styles.input}
        />
        <button type="submit" className={styles.createButton}>
          Crear
        </button>
      </form>
    </div>
  )
}
