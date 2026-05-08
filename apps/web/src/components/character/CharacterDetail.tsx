import { useEffect } from 'react'
import { useFriendGroups } from '../../hooks/useFriendGroups'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './CharacterDetail.module.css'

import { useCharacters } from '../../hooks/useCharacters'
import { GroupSelector } from '../friends/GroupSelector'
import { FriendThumbnails } from './FriendThumbnails'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const { groups, loadGroups, addCharacterToGroup, createGroup } = useFriendGroups()
  const { data: charactersList } = useCharacters()
  const slug = generateSlug(character.name)
  const imageSrc = character.image || '/images/placeholder-character.svg'

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{character.name}</h1>
      <div className={styles.detailContent}>
        <div className={styles.leftColumn}>
          <div className={styles.characterArea}>
            <img src={imageSrc} alt={character.name} className={styles.image} />
            <FriendThumbnails
              friendsString={character.technicalInfo?.mejoresAmigos}
              characters={charactersList}
            />
          </div>
          <GroupSelector
            groups={groups}
            characterSlug={slug}
            onAddToGroup={addCharacterToGroup}
            onCreateGroup={createGroup}
          />
        </div>
        <div className={styles.infoContainer}>
          {character.globalStory && (
            <div className={styles.globalStory}>{character.globalStory}</div>
          )}
        </div>
      </div>
    </article>
  )
}
