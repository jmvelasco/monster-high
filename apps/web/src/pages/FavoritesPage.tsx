import { useFavorites } from '../hooks/useFavorites'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div>
        <h1>Mis Favoritos</h1>
        <p>Sin favoritos aún</p>
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
