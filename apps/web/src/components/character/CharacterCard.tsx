import { Link } from 'react-router-dom'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'

interface CharacterCardProps {
  character: Character
  variant: 'list' | 'favorite'
}

export function CharacterCard({ character, variant }: CharacterCardProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'
  const slug = generateSlug(character.name)

  return (
    <Link to={`/character/${slug}`}>
      <img src={imageSrc} alt={character.name} loading="lazy" />
      {variant === 'list' && <div>{character.name}</div>}
    </Link>
  )
}
