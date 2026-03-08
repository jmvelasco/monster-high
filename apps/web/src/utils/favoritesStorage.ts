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

function persistFavorites(favorites: string[]): void {
  safeSetItem(STORAGE_KEY, JSON.stringify(favorites))
  inMemoryFavorites = favorites
}

export function saveFavorite(slug: string): void {
  const favorites = getFavorites()
  if (!favorites.includes(slug)) {
    favorites.push(slug)
    persistFavorites(favorites)
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
  persistFavorites(filtered)
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug)
}

/**
 * @internal Testing only - resets in-memory fallback state
 * Used by test-utils.ts to ensure clean state between tests
 */
export function __resetFavoritesForTesting(): void {
  inMemoryFavorites = []
}
