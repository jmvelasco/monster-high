import { getFavorites, isFavorite, removeFavorite, saveFavorite } from '../favoritesStorage'

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

  describe('removeFavorite', () => {
    it('elimina slug de localStorage', () => {
      localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura', 'clawdeen-wolf']))
      
      removeFavorite('draculaura')

      expect(localStorage.getItem('monster-high-favorites')).toBe(
        JSON.stringify(['clawdeen-wolf'])
      )
    })
  })

  describe('isFavorite', () => {
    it('retorna true si slug está en favoritos', () => {
      localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))
      
      expect(isFavorite('draculaura')).toBe(true)
    })
  })
})
