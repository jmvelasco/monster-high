import type { Character } from '../../types/character'
import styles from './FriendThumbnails.module.css'

interface FriendThumbnailsProps {
  friendsString?: string
  characters?: Character[]
}

export function FriendThumbnails({ friendsString, characters = [] }: FriendThumbnailsProps) {
  if (!friendsString) return null

  const friendNames = friendsString.split(',').map(name => name.trim())

  return (
    <div className={styles.container}>
      {friendNames.map((name, index) => {
        const character = characters.find(
          c => c.name.toLowerCase() === name.toLowerCase()
        )

        if (character?.image) {
          return (
            <img
              key={`${name}-${index}`}
              src={character.image}
              alt={character.name}
              className={styles.thumbnail}
              title={character.name}
            />
          )
        }

        const initials = name
          .split(' ')
          .map(n => n[0])
          .join('')
          .substring(0, 2)

        return (
          <div key={`${name}-${index}`} className={styles.initials} title={name}>
            {initials}
          </div>
        )
      })}
    </div>
  )
}
