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

  describe('getFavorites', () => {
    it('lee slugs desde localStorage', () => {
      localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura', 'clawdeen-wolf']))

      expect(getFavorites()).toEqual(['draculaura', 'clawdeen-wolf'])
    })
  })
})
