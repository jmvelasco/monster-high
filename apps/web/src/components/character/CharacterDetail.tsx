import type { Character } from '../../types/character'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'

  return (
    <div>
      <img src={imageSrc} alt={character.name} />
    </div>
  )
}
