import { useEffect } from 'react'
import type { Character } from '../../characters/domain/Character'
import { useCharacters } from '../../hooks/useCharacters'
import { useFriendGroups } from '../../hooks/useFriendGroups'
import { generateSlug } from '../../shared/domain/slugUtils'
import { GroupSelector } from '../friends/GroupSelector'
import styles from './CharacterDetail.module.css'
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
        <div className={styles.characterPanel}>
          <div className={styles.characterArea}>
            <img
              src={imageSrc}
              alt={character.name}
              width={400}
              height={533}
              fetchPriority="high"
              className={styles.image}
            />
            <FriendThumbnails
              friendsString={character.technicalInfo?.mejoresAmigos}
              characters={charactersList}
            />
          </div>
        </div>
        <div className={styles.storySection}>
          {character.globalStory && (
            <div className={styles.globalStory}>{character.globalStory}</div>
          )}
        </div>
        <div className={styles.groupSelector}>
          <GroupSelector
            groups={groups}
            characterSlug={slug}
            onAddToGroup={addCharacterToGroup}
            onCreateGroup={createGroup}
          />
        </div>
      </div>
    </article>
  )
}
