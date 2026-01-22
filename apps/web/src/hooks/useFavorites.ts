import { useEffect, useState } from 'react'
import { getFavorites as getStoredFavorites } from '../utils/favoritesStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(getStoredFavorites())
  }, [])

  return {
    favorites,
    toggleFavorite: (slug: string) => {},
    isFavorite: (slug: string) => false
  }
}
