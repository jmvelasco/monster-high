import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFriendGroups } from '../useFriendGroups'

describe('The Friend Groups Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty groups initially', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.loadGroups()
    })

    expect(result.current.groups).toEqual([])
  })

  it('creates a new group and includes it in the list', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.createGroup('Vampiras')
    })

    expect(result.current.groups).toHaveLength(1)
    expect(result.current.groups[0].name).toBe('Vampiras')
    expect(result.current.groups[0].members).toEqual([])
  })

  it('adds a character to an existing group', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.createGroup('Vampiras')
    })

    const groupId = result.current.groups[0].id

    await act(async () => {
      await result.current.addCharacterToGroup('draculaura', groupId)
    })

    expect(result.current.groups[0].members).toEqual(['draculaura'])
  })

  it('does not duplicate a character already in the group', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.createGroup('Vampiras')
    })

    const groupId = result.current.groups[0].id

    await act(async () => {
      await result.current.addCharacterToGroup('draculaura', groupId)
    })

    await act(async () => {
      await result.current.addCharacterToGroup('draculaura', groupId)
    })

    expect(result.current.groups[0].members).toEqual(['draculaura'])
  })

  it('removes a group', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.createGroup('Vampiras')
    })

    const groupId = result.current.groups[0].id

    await act(async () => {
      await result.current.removeGroup(groupId)
    })

    expect(result.current.groups).toEqual([])
  })

  it('gets a group by slug', async () => {
    const { result } = renderHook(() => useFriendGroups())

    await act(async () => {
      await result.current.createGroup('Vampiras')
    })

    const slug = result.current.groups[0].slug

    let found
    await act(async () => {
      found = await result.current.getGroupBySlug(slug)
    })

    expect(found?.name).toBe('Vampiras')
  })
})
