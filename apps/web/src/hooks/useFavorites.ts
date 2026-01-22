import { useState } from 'react'
import { getFavorites as getStoredFavorites, isFavorite as isStoredFavorite, removeFavorite, saveFavorite } from '../utils/favoritesStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getStoredFavorites())

  function toggleFavorite(slug: string) {
    if (isStoredFavorite(slug)) {
      removeFavorite(slug)
    } else {
      saveFavorite(slug)
    }
    setFavorites(getStoredFavorites())
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite: isStoredFavorite
  }
}
