import { useNavigate } from 'react-router-dom'
import { CharacterCard } from '../components/character/CharacterCard'
import { useCharacters } from '../hooks/useCharacters'
import { useFavorites } from '../hooks/useFavorites'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const { data: characters, isLoading, error } = useCharacters()

  if (isLoading) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Favoritos</h1>
        </div>
        <div>Cargando favoritos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Favoritos</h1>
        </div>
        <div>Error al cargar favoritos</div>
      </div>
    )
  }

  const favoriteCharacters = characters?.filter(char => {
    const slug = char.name.toLowerCase().replace(/\s+/g, '-')
    return favorites.includes(slug)
  }) || []

  if (favorites.length === 0 || favoriteCharacters.length === 0) {
    return (
      <div className={styles.favoritesPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Favoritos</h1>
          <p className={styles.subtitle}>Tus personajes Monster High favoritos aparecerán aquí</p>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💔</div>
          <div className={styles.emptyMessage}>Sin favoritos aún</div>
          <p className={styles.emptySubMessage}>Explora la galería y agrega tus personajes Monster High favoritos</p>
          <button className={styles.ctaButton} onClick={() => navigate('/characters')}>
            Explorar Personajes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Favoritos</h1>
        <p className={styles.subtitle}>{favoriteCharacters.length} personaje{favoriteCharacters.length === 1 ? '' : 's'} favorito{favoriteCharacters.length === 1 ? '' : 's'}</p>
      </div>
      <div className={styles.gridContainer}>
        {favoriteCharacters.map(character => (
          <CharacterCard key={character.name} character={character} variant="favorite" />
        ))}
      </div>
    </div>
  )
}
