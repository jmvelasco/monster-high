import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './CharacterCard.module.css'

interface CharacterCardProps {
  character: Character
  variant: 'list' | 'favorite'
}

export function CharacterCard({ character, variant }: CharacterCardProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'
  const slug = generateSlug(character.name)

  const cardClass = variant === 'favorite' ? `${styles.card} ${styles.cardFavorite}` : styles.card

  return (
    <Link to={`/character/${slug}`} className={cardClass}>
      <img src={imageSrc} alt={character.name} loading="lazy" referrerPolicy="no-referrer" className={styles.image} />
      <div className={styles.content}>
        <div className={styles.name}>{character.name}</div>
      </div>
    </Link>
  )
}
