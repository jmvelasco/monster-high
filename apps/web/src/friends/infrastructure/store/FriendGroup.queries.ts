import { useQuery } from '@tanstack/react-query'
import { Maybe } from '../../../shared/domain/Maybe'
import type { FriendGroup } from '../../domain/FriendGroup'
import { useFriendGroupUseCases } from '../context/FriendGroupUseCases.context'

export const friendGroupsKey = ['friendGroups']

export function useFriendGroupsQuery() {
  const useCases = useFriendGroupUseCases()
  const query = useQuery<FriendGroup[]>({
    queryKey: friendGroupsKey,
    queryFn: () => useCases.list.execute(),
  })

  const groups = () => query.data ?? []
  const hasGroups = () => groups().length > 0
  const findBySlug = (slug: string) => Maybe.fromNullable(groups().find(g => g.slug === slug))
  const errorMessage = () => (query.error instanceof Error ? query.error.message : '')

  return {
    isLoading: query.isLoading,
    groups,
    hasGroups,
    findBySlug,
    errorMessage,
  }
}
