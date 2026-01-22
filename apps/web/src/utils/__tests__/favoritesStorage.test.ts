import { beforeEach, describe, expect, it } from 'vitest'
import { getFavorites, isFavorite, removeFavorite, saveFavorite } from '../favoritesStorage'
import { resetFavoritesState } from '../../__tests__/test-utils'

describe('favoritesStorage', () => {
  beforeEach(() => {
    resetFavoritesState()
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

  describe('Graceful degradation', () => {
    it('usa memoria en lugar de localStorage cuando no está disponible', () => {
      // Simular localStorage no disponible
      const originalLocalStorage = globalThis.localStorage
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: () => { throw new Error('localStorage not available') },
          setItem: () => { throw new Error('localStorage not available') },
          clear: () => {}
        },
        writable: true
      })

      try {
        saveFavorite('draculaura')
        expect(getFavorites()).toContain('draculaura')
      } finally {
        Object.defineProperty(globalThis, 'localStorage', {
          value: originalLocalStorage,
          writable: true
        })
      }
    })
  })
})
