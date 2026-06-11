import { FindCharacterBySlugUseCase } from '../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../characters/application/ListCharactersUseCase'
import { AddMemberToGroupUseCase } from '../../friends/application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../friends/application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../friends/application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../friends/application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../friends/application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../friends/application/RemoveMemberFromGroupUseCase'
import { characterRepository, friendGroupRepository } from './repositories'

export class Factory {
  static createListCharactersUseCase(): ListCharactersUseCase {
    return new ListCharactersUseCase(characterRepository)
  }

  static createFindCharacterBySlugUseCase(): FindCharacterBySlugUseCase {
    return new FindCharacterBySlugUseCase(characterRepository)
  }

  static createListFriendGroupsUseCase(): ListFriendGroupsUseCase {
    return new ListFriendGroupsUseCase(friendGroupRepository)
  }

  static createFindFriendGroupBySlugUseCase(): FindFriendGroupBySlugUseCase {
    return new FindFriendGroupBySlugUseCase(friendGroupRepository)
  }

  static createCreateFriendGroupUseCase(): CreateFriendGroupUseCase {
    return new CreateFriendGroupUseCase(friendGroupRepository)
  }

  static createAddMemberToGroupUseCase(): AddMemberToGroupUseCase {
    return new AddMemberToGroupUseCase(friendGroupRepository)
  }

  static createRemoveMemberFromGroupUseCase(): RemoveMemberFromGroupUseCase {
    return new RemoveMemberFromGroupUseCase(friendGroupRepository)
  }

  static createDeleteFriendGroupUseCase(): DeleteFriendGroupUseCase {
    return new DeleteFriendGroupUseCase(friendGroupRepository)
  }
}
