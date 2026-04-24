import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageFriendGroupRepository } from '../LocalStorageFriendGroupRepository'
import { migrateFavoritesToBffs } from '../migrateFavoritesToBffs'

describe('The Favorites Migration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a BFFs group containing the old favorite slugs', async () => {
    const oldFavorites = ['draculaura', 'clawdeen-wolf']
    localStorage.setItem('monster-high-favorites', JSON.stringify(oldFavorites))

    const result = await migrateFavoritesToBffs()

    expect(result).not.toBeNull()
    expect(result!.name).toBe('BFFs')
    expect(result!.members).toEqual(['draculaura', 'clawdeen-wolf'])
  })

  it('removes the old favorites key after migration', async () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))

    await migrateFavoritesToBffs()

    expect(localStorage.getItem('monster-high-favorites')).toBeNull()
  })

  it('returns null when no old favorites exist', async () => {
    const result = await migrateFavoritesToBffs()

    expect(result).toBeNull()
  })

  it('returns null when old favorites is an empty array', async () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify([]))

    const result = await migrateFavoritesToBffs()

    expect(result).toBeNull()
  })

  it('persists the BFFs group in the repository', async () => {
    localStorage.setItem('monster-high-favorites', JSON.stringify(['draculaura']))
    const repository = new LocalStorageFriendGroupRepository()

    await migrateFavoritesToBffs()

    const groups = await repository.findAll()
    expect(groups).toHaveLength(1)
    expect(groups[0].name).toBe('BFFs')
    expect(groups[0].members).toEqual(['draculaura'])
  })
})
