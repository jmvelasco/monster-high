import { useEffect } from 'react'
import type { Character } from '../../../domain/Character'
import { useCharactersQuery } from '../../store/Character.queries'
import { useFriendGroups } from '../../../../hooks/useFriendGroups'
import { generateSlug } from '../../../../shared/domain/slugUtils'
import { GroupSelector } from '../../../../components/friends/GroupSelector'
import styles from './CharacterDetail.module.css'
import { FriendThumbnails } from '../FriendThumbnails/FriendThumbnails'

interface Props {
  character: Character
}

export function CharacterDetail(props: Props) {
  const friendGroups = useFriendGroups()
  const charactersQuery = useCharactersQuery()
  const slug = generateSlug(props.character.name)
  const imageSrc = props.character.image || '/images/placeholder-character.svg'

  useEffect(() => {
    friendGroups.loadGroups()
  }, [friendGroups.loadGroups])

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{props.character.name}</h1>
      <div className={styles.detailContent}>
        <div className={styles.characterPanel}>
          <div className={styles.characterArea}>
            <img
              src={imageSrc}
              alt={props.character.name}
              width={400}
              height={533}
              fetchPriority="high"
              className={styles.image}
            />
            <FriendThumbnails
              friendsString={props.character.technicalInfo?.mejoresAmigos}
              characters={charactersQuery.characters()}
            />
          </div>
        </div>
        <div className={styles.storySection}>
          {props.character.globalStory && (
            <div className={styles.globalStory}>{props.character.globalStory}</div>
          )}
        </div>
        <div className={styles.groupSelector}>
          <GroupSelector
            groups={friendGroups.groups}
            characterSlug={slug}
            onAddToGroup={friendGroups.addCharacterToGroup}
            onCreateGroup={friendGroups.createGroup}
          />
        </div>
      </div>
    </article>
  )
}
