const STORAGE_KEY = 'monster-high-favorites'

export function saveFavorite(slug: string): void {
  const favorites = [slug]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function getFavorites(): string[] {
  return []
}

export function removeFavorite(slug: string): void {
  // Placeholder para compilar
}

export function isFavorite(slug: string): boolean {
  return false
}
