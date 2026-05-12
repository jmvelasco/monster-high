import { useQuery } from '@tanstack/react-query'
import type { Character } from '../characters/domain/Character'
import { useCharacterUseCases } from '../characters/infrastructure/context/CharacterUseCases.context'

export function useCharacter(slug: string) {
  const characterUseCases = useCharacterUseCases()
  const query = useQuery<Character | null>({
    queryKey: ['character', slug],
    queryFn: () => characterUseCases.findBySlug.execute(slug),
  })

  return {
    data: query.data ?? undefined,
    isLoading: query.isLoading,
    error: query.error ?? undefined,
  }
}
