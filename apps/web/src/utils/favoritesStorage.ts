const STORAGE_KEY = 'monster-high-favorites'
let inMemoryFavorites: string[] = []

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Fallback: guardar en memoria
  }
}

export function saveFavorite(slug: string): void {
  const favorites = getFavorites()
  if (!favorites.includes(slug)) {
    favorites.push(slug)
    safeSetItem(STORAGE_KEY, JSON.stringify(favorites))
    inMemoryFavorites = favorites
  }
}

export function getFavorites(): string[] {
  const stored = safeGetItem(STORAGE_KEY)
  if (stored) {
    inMemoryFavorites = JSON.parse(stored)
    return inMemoryFavorites
  }
  return inMemoryFavorites
}

export function removeFavorite(slug: string): void {
  const favorites = getFavorites()
  const filtered = favorites.filter(s => s !== slug)
  safeSetItem(STORAGE_KEY, JSON.stringify(filtered))
  inMemoryFavorites = filtered
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug)
}
