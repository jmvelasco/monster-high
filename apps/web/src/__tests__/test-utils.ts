/**
 * Test utilities and helpers
 * Centralized location for testing-specific functions
 */

/**
 * Reset all storage state for testing
 *
 * Clears localStorage to ensure clean state between tests
 */
export function resetStorageState(): void {
  localStorage.clear()
}
