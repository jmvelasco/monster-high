const STORAGE_KEY = 'monster-high-favorites'

export function saveFavorite(slug: string): void {
  const favorites = [slug]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function getFavorites(): string[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function removeFavorite(slug: string): void {
  const favorites = getFavorites()
  const filtered = favorites.filter(s => s !== slug)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function isFavorite(slug: string): boolean {
  return false
}
