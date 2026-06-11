import type { Character } from '../../../domain/entities/Character'
import { CharacterCard } from '../CharacterCard/CharacterCard'
import styles from './CharacterGrid.module.css'

interface Props {
  characters: Character[]
  emptyMessage?: string
}

export function CharacterGrid(props: Props) {
  const emptyMessage = props.emptyMessage ?? 'No hay personajes disponibles'
  if (props.characters.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          👻
        </div>
        <div className={styles.emptyMessage}>{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {props.characters.map(character => (
        <CharacterCard key={character.name} character={character} variant="list" />
      ))}
    </div>
  )
}
