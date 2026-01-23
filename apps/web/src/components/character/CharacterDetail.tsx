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
    <article className={styles.detail}>
      <h1 className={styles.title}>{character.name}</h1>
      <div className={styles.detailContent}>
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={character.name} className={styles.image} />
          <button className={styles.favoriteButton} onClick={() => toggleFavorite(slug)}>
            {isFav ? '❤️ Favorito' : '🤍 Agregar a Favoritos'}
          </button>
        </div>
        <div className={styles.infoContainer}>
        <div className={styles.technicalInfo}>
          {Object.entries(character.technicalInfo).map(([key, value]) => {
            if (!value) return null
            return (
              <div key={key} className={styles.infoRow}>
                <span className={styles.infoLabel}>{TECHNICAL_INFO_LABELS[key]}</span>
                <span className={styles.infoValue}>{value}</span>
              </div>
            )
          })}
        </div>
        {character.globalStory && (
          <div className={styles.globalStory}>{character.globalStory}</div>
        )}
      </div>
      </div>
    </article>
  )
}
