import { saveFavorite, getFavorites, removeFavorite, isFavorite } from '../favoritesStorage'

describe('favoritesStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveFavorite', () => {
    it('guarda slug en localStorage', () => {
      saveFavorite('draculaura')

      expect(localStorage.getItem('monster-high-favorites')).toBe(
        JSON.stringify(['draculaura'])
      )
    })
  })
})
