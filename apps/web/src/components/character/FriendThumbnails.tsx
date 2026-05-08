import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './FriendThumbnails.module.css'

interface FriendThumbnailsProps {
  friendsString?: string
  characters?: Character[]
}

export function FriendThumbnails({ friendsString, characters = [] }: FriendThumbnailsProps) {
  if (!friendsString) return null

  const friendNames = friendsString.split(',').map(name => name.trim())

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Mejores Amistades</h3>
      <div className={styles.container}>
        {friendNames.map((name, index) => {
        const character = characters.find(
          c => c.name.toLowerCase() === name.toLowerCase()
        )

        if (character?.image) {
          return (
            <Link
              to={`/character/${generateSlug(character.name)}`}
              key={`${name}-${index}`}
              className={styles.thumbnailLink}
              title={character.name}
            >
              <img
                src={character.image}
                alt={character.name}
                className={styles.thumbnail}
              />
            </Link>
          )
        }

        const initials = name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)

        return (
          <Link
            to={`/character/${generateSlug(name)}`}
            key={`${name}-${index}`}
            className={`${styles.initials} ${styles.thumbnailLink}`}
            title={name}
          >
            {initials}
          </Link>
        )
      })}
      </div>
    </div>
  )
}
