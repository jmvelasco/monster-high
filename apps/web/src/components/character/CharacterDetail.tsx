import { useFavorites } from '../../hooks/useFavorites'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './CharacterDetail.module.css'

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
  const { toggleFavorite, isFavorite } = useFavorites()
  const slug = generateSlug(character.name)
  const isFav = isFavorite(slug)
  const imageSrc = character.image || '/images/placeholder-character.svg'

  return (
    <article>
      <img src={imageSrc} alt={character.name} />
      <button onClick={() => toggleFavorite(slug)}>
        {isFav ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
      </button>
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
      {character.globalStory && (
        <div className={styles.globalStory}>{character.globalStory}</div>
      )}
    </article>
  )
}
