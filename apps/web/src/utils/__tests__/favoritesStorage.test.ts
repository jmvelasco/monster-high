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

    it('agrega slug a favoritos existentes sin duplicar', () => {
      localStorage.setItem('monster-high-favorites', JSON.stringify(['clawdeen-wolf']))
      
      saveFavorite('draculaura')

      expect(JSON.parse(localStorage.getItem('monster-high-favorites')!)).toEqual(
        expect.arrayContaining(['draculaura', 'clawdeen-wolf'])
      )
      expect(JSON.parse(localStorage.getItem('monster-high-favorites')!).length).toBe(2)
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
