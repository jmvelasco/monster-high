import type { Character } from '../../types/character'

interface CharacterCardProps {
  character: Character
  variant: 'list' | 'favorite'
}

export function CharacterCard({ character }: CharacterCardProps) {
  return <div>{character.name}</div>
}
