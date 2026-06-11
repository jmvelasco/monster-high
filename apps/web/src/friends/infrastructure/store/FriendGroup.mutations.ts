import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFriendGroupUseCases } from '../context/FriendGroupUseCases.context'
import { friendGroupsKey } from './FriendGroup.queries'

export function useFriendGroupMutations() {
  const useCases = useFriendGroupUseCases()
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: friendGroupsKey })

  const create = useMutation({
    mutationFn: (name: string) => useCases.create.execute(name),
    onSuccess,
  })

  const addMember = useMutation({
    mutationFn: ({ slug, groupId }: { slug: string; groupId: string }) =>
      useCases.addMember.execute(slug, groupId),
    onSuccess,
  })

  const removeMember = useMutation({
    mutationFn: ({ slug, groupId }: { slug: string; groupId: string }) =>
      useCases.removeMember.execute(slug, groupId),
    onSuccess,
  })

  const deleteGroup = useMutation({
    mutationFn: (groupId: string) => useCases.deleteGroup.execute(groupId),
    onSuccess,
  })

  return { create, addMember, removeMember, deleteGroup }
}
