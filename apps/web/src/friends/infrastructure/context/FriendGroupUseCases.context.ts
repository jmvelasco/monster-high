import { createContext, useContext } from 'react'
import type { AddMemberToGroupUseCase } from '../../application/AddMemberToGroupUseCase'
import type { CreateFriendGroupUseCase } from '../../application/CreateFriendGroupUseCase'
import type { DeleteFriendGroupUseCase } from '../../application/DeleteFriendGroupUseCase'
import type { FindFriendGroupBySlugUseCase } from '../../application/FindFriendGroupBySlugUseCase'
import type { ListFriendGroupsUseCase } from '../../application/ListFriendGroupsUseCase'
import type { RemoveMemberFromGroupUseCase } from '../../application/RemoveMemberFromGroupUseCase'

export interface FriendGroupUseCases {
  list: ListFriendGroupsUseCase
  findBySlug: FindFriendGroupBySlugUseCase
  create: CreateFriendGroupUseCase
  addMember: AddMemberToGroupUseCase
  removeMember: RemoveMemberFromGroupUseCase
  deleteGroup: DeleteFriendGroupUseCase
}

const FriendGroupUseCasesContext = createContext<FriendGroupUseCases | null>(null)

export const FriendGroupUseCasesProvider = FriendGroupUseCasesContext.Provider

export function useFriendGroupUseCases(): FriendGroupUseCases {
  const context = useContext(FriendGroupUseCasesContext)
  if (context === null) {
    throw new Error('useFriendGroupUseCases must be used within a FriendGroupUseCasesProvider')
  }
  return context
}
