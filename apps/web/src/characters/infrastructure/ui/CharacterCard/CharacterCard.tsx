import { Link } from 'react-router-dom'
import { generateSlug } from '../../../../shared/domain/slugUtils'
import type { Character } from '../../../domain/entities/Character'
import styles from './CharacterCard.module.css'

interface Props {
  character: Character
  variant: 'list' | 'favorite'
  children?: React.ReactNode
}

export function CharacterCard(props: Props) {
  const imageSrc = props.character.image || '/images/placeholder-character.svg'
  const slug = generateSlug(props.character.name)
  const cardClass = props.variant === 'favorite' ? styles.cardFavorite : styles.card

  return (
    <article className={cardClass}>
      <Link
        to={`/character/${slug}`}
        className={styles.imageLink}
        aria-label={props.character.name}
      >
        <img
          src={imageSrc}
          alt={props.character.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          width={300}
          height={300}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <Link to={`/character/${slug}`} className={styles.nameLink}>
          <h2 className={styles.name}>{props.character.name}</h2>
        </Link>
        {props.children}
      </div>
    </article>
  )
}
