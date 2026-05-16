import { FindCharacterBySlugUseCase } from '../../characters/application/FindCharacterBySlugUseCase'
import { ListCharactersUseCase } from '../../characters/application/ListCharactersUseCase'
import { HttpCharacterRepository } from '../../characters/infrastructure/persistence/HttpCharacterRepository'
import { AddMemberToGroupUseCase } from '../../friends/application/AddMemberToGroupUseCase'
import { CreateFriendGroupUseCase } from '../../friends/application/CreateFriendGroupUseCase'
import { DeleteFriendGroupUseCase } from '../../friends/application/DeleteFriendGroupUseCase'
import { FindFriendGroupBySlugUseCase } from '../../friends/application/FindFriendGroupBySlugUseCase'
import { ListFriendGroupsUseCase } from '../../friends/application/ListFriendGroupsUseCase'
import { RemoveMemberFromGroupUseCase } from '../../friends/application/RemoveMemberFromGroupUseCase'
import { LocalStorageFriendGroupRepository } from '../../friends/infrastructure/persistence/LocalStorageFriendGroupRepository'

export class Factory {
  static createListCharactersUseCase(): ListCharactersUseCase {
    const repository = new HttpCharacterRepository()
    return new ListCharactersUseCase(repository)
  }

  static createFindCharacterBySlugUseCase(): FindCharacterBySlugUseCase {
    const repository = new HttpCharacterRepository()
    return new FindCharacterBySlugUseCase(repository)
  }

  static createListFriendGroupsUseCase(): ListFriendGroupsUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new ListFriendGroupsUseCase(repository)
  }

  static createFindFriendGroupBySlugUseCase(): FindFriendGroupBySlugUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new FindFriendGroupBySlugUseCase(repository)
  }

  static createCreateFriendGroupUseCase(): CreateFriendGroupUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new CreateFriendGroupUseCase(repository)
  }

  static createAddMemberToGroupUseCase(): AddMemberToGroupUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new AddMemberToGroupUseCase(repository)
  }

  static createRemoveMemberFromGroupUseCase(): RemoveMemberFromGroupUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new RemoveMemberFromGroupUseCase(repository)
  }

  static createDeleteFriendGroupUseCase(): DeleteFriendGroupUseCase {
    const repository = new LocalStorageFriendGroupRepository()
    return new DeleteFriendGroupUseCase(repository)
  }
}
