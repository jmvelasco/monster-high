import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CharacterCard } from '../components/character/CharacterCard'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import type { FriendGroup } from '../domain/friends/FriendGroup'
import { useCharacters } from '../hooks/useCharacters'
import { useFriendGroups } from '../hooks/useFriendGroups'
import { generateSlug } from '../utils/slugUtils'
import styles from './FriendGroupDetailPage.module.css'

export function FriendGroupDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getGroupBySlug, removeGroup } = useFriendGroups()
  const { data: characters } = useCharacters()

  const [group, setGroup] = useState<FriendGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  useEffect(() => {
    async function loadGroup() {
      if (!slug) return
      const foundGroup = await getGroupBySlug(slug)
      setGroup(foundGroup)
      setIsLoading(false)
    }
    loadGroup()
  }, [slug])

  if (isLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!group) {
    return (
      <div className={styles.notFound}>
        <h2>Grupo no encontrado</h2>
        <button onClick={() => navigate('/friends')} className={styles.backButton}>
          Volver a Mis Amigas
        </button>
      </div>
    )
  }

  const handleDeleteGroup = async () => {
    await removeGroup(group.id)
    setIsConfirmOpen(false)
    navigate('/friends')
  }

  const groupCharacters =
    characters?.filter(char => group.members.includes(generateSlug(char.name))) || []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{group.name}</h1>
          <p className={styles.memberCount}>
            {group.members.length} {group.members.length === 1 ? 'amiga' : 'amigas'}
          </p>
        </div>
        <button onClick={() => setIsConfirmOpen(true)} className={styles.deleteButton}>
          Eliminar grupo
        </button>
      </header>

      <div className={styles.grid}>
        {groupCharacters.length === 0 ? (
          <p className={styles.emptyMessage}>Este grupo no tiene amigas todavía.</p>
        ) : (
          groupCharacters.map(character => (
            <CharacterCard key={character.name} character={character} variant="list" />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar grupo"
        message={`¿Estás segura de que quieres eliminar el grupo "${group.name}"? Esta acción no se puede deshacer y los personajes perderán esta etiqueta.`}
        confirmText="Eliminar grupo"
        onConfirm={handleDeleteGroup}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  )
}
