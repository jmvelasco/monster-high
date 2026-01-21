import type { Character } from '../../types/character'

interface CharacterGridProps {
  characters: Character[]
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  if (characters.length === 0) {
    return <div>No hay personajes disponibles</div>
  }

  return null
}
