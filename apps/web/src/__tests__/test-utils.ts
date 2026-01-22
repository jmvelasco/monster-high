/**
 * Test utilities and helpers
 * Centralized location for testing-specific functions
 * 
 * This file contains ONLY testing utilities.
 * No testing code contaminating production modules.
 */

import { __resetFavoritesForTesting } from '../utils/favoritesStorage'

/**
 * Reset all favorites storage state for testing
 * 
 * Clears both localStorage and the in-memory fallback
 */
export function resetFavoritesState(): void {
  localStorage.clear()
  __resetFavoritesForTesting()
}
