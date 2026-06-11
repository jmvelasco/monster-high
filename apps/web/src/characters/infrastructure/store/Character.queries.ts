import { useQuery } from '@tanstack/react-query'
import { Maybe } from '../../../shared/domain/Maybe'
import { generateSlug } from '../../../shared/domain/slugUtils'
import type { Character } from '../../domain/entities/Character'
import { useCharacterUseCases } from '../context/CharacterUseCases.context'

export const charactersKey = ['characters']

export function useCharactersQuery() {
  const useCases = useCharacterUseCases()
  const query = useQuery<Character[]>({
    queryKey: charactersKey,
    queryFn: () => useCases.list.execute(),
  })

  const characters = () => query.data ?? []
  const hasCharacters = () => characters().length > 0
  const findBySlug = (slug: string) =>
    Maybe.fromNullable(characters().find(c => generateSlug(c.name) === slug))
  const errorMessage = () => (query.error instanceof Error ? query.error.message : '')

  return {
    isLoading: query.isLoading,
    characters,
    hasCharacters,
    findBySlug,
    errorMessage,
  }
}
