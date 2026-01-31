import useSWR from 'swr'
import type { Character } from '../types/character'

interface UseCharactersResult {
  data: Character[] | undefined
  error: Error | undefined
  isLoading: boolean
}

const fetcher = async (url: string): Promise<Character[]> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  return response.json()
}

export function useCharacters(): UseCharactersResult {
  const { data, error, isLoading } = useSWR<Character[]>('/api/characters.json', fetcher)

  return {
    data,
    error,
    isLoading,
  }
}
