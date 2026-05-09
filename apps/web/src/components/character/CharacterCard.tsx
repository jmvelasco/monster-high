import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './CharacterCard.module.css'

interface CharacterCardProps {
  character: Character
  variant: 'list' | 'favorite'
  children?: React.ReactNode
}

export function CharacterCard({ character, variant, children }: CharacterCardProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'
  const slug = generateSlug(character.name)

  const cardClass = variant === 'favorite' ? `${styles.card} ${styles.cardFavorite}` : styles.card

  return (
    <article className={cardClass}>
      <Link to={`/character/${slug}`} className={styles.imageLink} aria-label={character.name}>
        <img
          src={imageSrc}
          alt={character.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          width={300}
          height={300}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <Link to={`/character/${slug}`} className={styles.nameLink}>
          <h2 className={styles.name}>{character.name}</h2>
        </Link>
        {children}
      </div>
    </article>
  )
}
