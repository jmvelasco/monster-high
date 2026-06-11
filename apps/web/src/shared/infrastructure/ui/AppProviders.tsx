import type { ReactNode } from 'react'
import type { FindCharacterBySlugUseCase } from '../../../characters/application/FindCharacterBySlugUseCase'
import type { ListCharactersUseCase } from '../../../characters/application/ListCharactersUseCase'
import { CharacterUseCasesProvider } from '../../../characters/infrastructure/context/CharacterUseCases.context'
import type { FriendGroupUseCases } from '../../../friends/infrastructure/context/FriendGroupUseCases.context'
import { FriendGroupUseCasesProvider } from '../../../friends/infrastructure/context/FriendGroupUseCases.context'

interface CharacterUseCases {
  list: ListCharactersUseCase
  findBySlug: FindCharacterBySlugUseCase
}

interface Props {
  characterUseCases: CharacterUseCases
  friendGroupUseCases: FriendGroupUseCases
  children: ReactNode
}

export function AppProviders(props: Props) {
  return (
    <CharacterUseCasesProvider value={props.characterUseCases}>
      <FriendGroupUseCasesProvider value={props.friendGroupUseCases}>
        {props.children}
      </FriendGroupUseCasesProvider>
    </CharacterUseCasesProvider>
  )
}
