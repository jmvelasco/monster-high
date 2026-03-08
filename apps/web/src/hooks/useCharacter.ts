import useSWR from 'swr'
import type { Character } from '../types/character'
import { generateSlug } from '../utils/slugUtils'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useCharacter(slug: string) {
  const { data: characters, error } = useSWR<Character[]>('/api/characters.json', fetcher)

  const character = characters?.find(character => {
    return generateSlug(character.name) === slug
  })

  return {
    data: character,
    isLoading: !error && !characters,
    error,
  }
}
