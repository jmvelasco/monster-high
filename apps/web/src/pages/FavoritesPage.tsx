import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div>
        <h1>Mis Favoritos</h1>
        <p>Sin favoritos aún</p>
        <button onClick={() => navigate('/characters')}>
          Explorar Personajes
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1>Mis Favoritos</h1>
      <ul>
        {favorites.map(slug => (
          <li key={slug} data-testid={`character-card-${slug}`}>
            {slug}
          </li>
        ))}
      </ul>
    </div>
  )
}
