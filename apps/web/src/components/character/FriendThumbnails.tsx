import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { generateSlug } from '../../shared/domain/slugUtils'
import styles from './FriendThumbnails.module.css'

interface FriendThumbnailsProps {
  friendsString?: string
  characters?: Character[]
}

export function FriendThumbnails({ friendsString, characters = [] }: FriendThumbnailsProps) {
  if (!friendsString) return null

  const friendNames = friendsString.split(',').map(name => name.trim())
  const characterByName = new Map(characters.map(c => [c.name.toLowerCase(), c]))

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Mejores Amistades</h2>
      <div className={styles.container}>
        {friendNames.map((name, index) => {
          const character = characterByName.get(name.toLowerCase())

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
                  width={72}
                  height={96}
                  className={styles.thumbnail}
                />
              </Link>
            )
          }
        })}
      </div>
    </div>
  )
}
