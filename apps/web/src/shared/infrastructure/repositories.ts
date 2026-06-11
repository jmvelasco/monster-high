import { HttpCharacterRepository } from '../../characters/infrastructure/persistence/HttpCharacterRepository'
import { LocalStorageFriendGroupRepository } from '../../friends/infrastructure/persistence/LocalStorageFriendGroupRepository'

export const characterRepository = new HttpCharacterRepository()
export const friendGroupRepository = new LocalStorageFriendGroupRepository()
