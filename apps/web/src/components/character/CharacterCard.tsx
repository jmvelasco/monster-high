import type { Character } from '../../types/character'

interface CharacterCardProps {
  character: Character
  variant: 'list' | 'favorite'
}

export function CharacterCard({ character, variant }: CharacterCardProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'

  return (
    <div>
      <img src={imageSrc} alt={character.name} />
      {variant === 'list' && <div>{character.name}</div>}
    </div>
  )
}
