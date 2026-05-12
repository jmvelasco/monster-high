import type { ReactNode } from 'react'
import type { FindCharacterBySlugUseCase } from '../../../characters/application/FindCharacterBySlugUseCase'
import type { ListCharactersUseCase } from '../../../characters/application/ListCharactersUseCase'
import { CharacterUseCasesProvider } from '../../../characters/infrastructure/context/CharacterUseCases.context'

interface CharacterUseCases {
  list: ListCharactersUseCase
  findBySlug: FindCharacterBySlugUseCase
}

interface Props {
  characterUseCases: CharacterUseCases
  children: ReactNode
}

export function AppProviders(props: Props) {
  return (
    <CharacterUseCasesProvider value={props.characterUseCases}>
      {props.children}
    </CharacterUseCasesProvider>
  )
}
