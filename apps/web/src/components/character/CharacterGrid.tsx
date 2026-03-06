import type { Character } from '../../types/character'
import { CharacterCard } from './CharacterCard'
import styles from './CharacterGrid.module.css'

interface CharacterGridProps {
  characters: Character[]
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>👻</div>
        <div className={styles.emptyMessage}>No hay personajes disponibles</div>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {characters.map(character => (
        <CharacterCard key={character.name} character={character} variant="list" />
      ))}
    </div>
  )
}
