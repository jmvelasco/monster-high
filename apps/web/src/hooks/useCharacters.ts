import { useQuery } from '@tanstack/react-query'
import type { Character } from '../characters/domain/Character'
import { useCharacterUseCases } from '../characters/infrastructure/context/CharacterUseCases.context'

interface UseCharactersResult {
  data: Character[] | undefined
  error: Error | undefined
  isLoading: boolean
}

export function useCharacters(): UseCharactersResult {
  const characterUseCases = useCharacterUseCases()
  const query = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: () => characterUseCases.list.execute(),
  })

  return {
    data: query.data,
    error: query.error ?? undefined,
    isLoading: query.isLoading,
  }
}
