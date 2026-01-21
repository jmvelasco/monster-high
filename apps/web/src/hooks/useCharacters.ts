import useSWR from 'swr'
import type { Character } from '../types/character'

interface UseCharactersResult {
  data: Character[] | undefined
  error: Error | null
  isLoading: boolean
}

export function useCharacters(): UseCharactersResult {
  const { data, error, isLoading } = useSWR<Character[]>('/api/characters.json')

  return {
    data,
    error: error || null,
    isLoading,
  }
}