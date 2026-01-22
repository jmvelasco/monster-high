import { useState } from 'react'
import { getFavorites as getStoredFavorites, isFavorite as isStoredFavorite, removeFavorite, saveFavorite } from '../utils/favoritesStorage'

export function useFavorites() {
  const [, setUpdateTrigger] = useState(0)
  
  // Always read from storage to ensure freshness
  const favorites = getStoredFavorites()

  function toggleFavorite(slug: string) {
    if (isStoredFavorite(slug)) {
      removeFavorite(slug)
    } else {
      saveFavorite(slug)
    }
    // Trigger re-render
    setUpdateTrigger(prev => prev + 1)
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite: isStoredFavorite
  }
}
