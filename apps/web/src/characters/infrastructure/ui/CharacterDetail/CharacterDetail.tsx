import { useFriendGroupMutations } from '../../../../friends/infrastructure/store/FriendGroup.mutations'
import { useFriendGroupsQuery } from '../../../../friends/infrastructure/store/FriendGroup.queries'
import { GroupSelector } from '../../../../friends/infrastructure/ui/GroupSelector/GroupSelector'
import { generateSlug } from '../../../../shared/domain/slugUtils'
import type { Character } from '../../../domain/entities/Character'
import { useCharactersQuery } from '../../store/Character.queries'
import { FriendThumbnails } from '../FriendThumbnails/FriendThumbnails'
import styles from './CharacterDetail.module.css'

interface Props {
  character: Character
}

export function CharacterDetail(props: Props) {
  const friendGroupsQuery = useFriendGroupsQuery()
  const friendGroupMutations = useFriendGroupMutations()
  const charactersQuery = useCharactersQuery()
  const slug = generateSlug(props.character.name)
  const imageSrc = props.character.image || '/images/placeholder-character.svg'

  function handleAddToGroup(characterSlug: string, groupId: string) {
    friendGroupMutations.addMember.mutate({ slug: characterSlug, groupId })
  }

  function handleCreateGroup(name: string) {
    friendGroupMutations.create.mutate(name)
  }

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
            groups={friendGroupsQuery.groups()}
            characterSlug={slug}
            onAddToGroup={handleAddToGroup}
            onCreateGroup={handleCreateGroup}
          />
        </div>
      </div>
    </article>
  )
}
