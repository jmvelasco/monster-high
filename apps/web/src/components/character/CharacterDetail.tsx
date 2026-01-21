import type { Character } from '../../types/character'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'

  return (
    <div>
      <img src={imageSrc} alt={character.name} />
      <div>
        {character.technicalInfo.edad && (
          <div>
            <span>Edad:</span> <span>{character.technicalInfo.edad}</span>
          </div>
        )}
        {character.technicalInfo.sexo && (
          <div>
            <span>Sexo:</span> <span>{character.technicalInfo.sexo}</span>
          </div>
        )}
        {character.technicalInfo.ocupacion && (
          <div>
            <span>Ocupación:</span> <span>{character.technicalInfo.ocupacion}</span>
          </div>
        )}
        {character.technicalInfo.mascota && (
          <div>
            <span>Mascota:</span> <span>{character.technicalInfo.mascota}</span>
          </div>
        )}
      </div>
    </div>
  )
}
