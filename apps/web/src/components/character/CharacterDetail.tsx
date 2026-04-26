import { useEffect } from 'react'
import { useFriendGroups } from '../../hooks/useFriendGroups'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import { GroupSelector } from '../friends/GroupSelector'
import styles from './CharacterDetail.module.css'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const { groups, loadGroups, addCharacterToGroup, createGroup } = useFriendGroups()
  const slug = generateSlug(character.name)
  const imageSrc = character.image || '/images/placeholder-character.svg'

  useEffect(() => {
    loadGroups()
  }, [])

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{character.name}</h1>
      <div className={styles.detailContent}>
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={character.name} className={styles.image} />
        </div>
        <div className={styles.infoContainer}>
          {character.globalStory && (
            <div className={styles.globalStory}>{character.globalStory}</div>
          )}
        </div>
      </div>
      <GroupSelector
        groups={groups}
        characterSlug={slug}
        onAddToGroup={addCharacterToGroup}
        onCreateGroup={createGroup}
      />
    </article>
  )
}
