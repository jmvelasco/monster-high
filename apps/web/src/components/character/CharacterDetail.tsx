import type { Character } from '../../types/character'

interface CharacterDetailProps {
  character: Character
}

const TECHNICAL_INFO_LABELS: Record<string, string> = {
  edad: 'Edad:',
  sexo: 'Sexo:',
  ocupacion: 'Ocupación:',
  mascota: 'Mascota:',
  familiares: 'Familiares:',
  mejoresAmigos: 'Mejores Amigos:',
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const imageSrc = character.image || '/images/placeholder-character.svg'

  return (
    <div>
      <img src={imageSrc} alt={character.name} />
      <div>
        {Object.entries(character.technicalInfo).map(([key, value]) => {
          if (!value) return null
          return (
            <div key={key}>
              <span>{TECHNICAL_INFO_LABELS[key]}</span> <span>{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
