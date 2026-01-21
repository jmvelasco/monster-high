import useSWR from 'swr'
import type { Character } from '../types/character'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCharacter(slug: string) {
  const { data: characters, error } = useSWR<Character[]>(
    '/api/characters.json',
    fetcher
  )

  const character = characters?.find((character) => {
    const characterSlug = character.name.toLowerCase().replace(/\s+/g, '-')
    return characterSlug === slug
  })

  return {
    data: character,
    isLoading: !error && !characters,
    error,
  }
}
