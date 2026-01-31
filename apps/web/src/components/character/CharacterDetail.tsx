import { useEffect, useRef } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import type { Character } from '../../types/character'
import { generateSlug } from '../../utils/slugUtils'
import styles from './CharacterDetail.module.css'

interface CharacterDetailProps {
  character: Character
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const spanRef = useRef<HTMLSpanElement>(null)
  const slug = generateSlug(character.name)
  const isFav = isFavorite(slug)
  const imageSrc = character.image || '/images/placeholder-character.svg'

  const handleMouseEnter = () => {
    if (spanRef.current) {
      spanRef.current.textContent = isFav ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'
    }
  }

  const handleMouseLeave = () => {
    if (spanRef.current) {
      spanRef.current.textContent = isFav ? '❤️ Favorito' : '🤍 Agregar a Favoritos'
    }
  }

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = isFav ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'
    }
  }, [isFav])

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{character.name}</h1>
      <div className={styles.detailContent}>
        <div className={styles.imageContainer}>
          <img src={imageSrc} alt={character.name} className={styles.image} />
        </div>
        <div className={styles.infoContainer}>
          {character.globalStory && (
            <div className={styles.globalStory}>{character.globalStory}</div>
          )}
        </div>
      </div>
      <button
        className={`${styles.favoriteButton} ${isFav ? styles.isFavorite : ''}`}
        onClick={() => toggleFavorite(slug)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span ref={spanRef} />
      </button>
    </article>
  )
}
