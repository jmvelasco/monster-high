import type { Character } from '../../types/character'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <div>
      <img src={character.image} alt={character.name} />
    </div>
  )
}
