import { createContext, useContext } from 'react'
import type { FindCharacterBySlugUseCase } from '../../application/FindCharacterBySlugUseCase'
import type { ListCharactersUseCase } from '../../application/ListCharactersUseCase'

interface CharacterUseCases {
  list: ListCharactersUseCase
  findBySlug: FindCharacterBySlugUseCase
}

const CharacterUseCasesContext = createContext<CharacterUseCases | null>(null)

export const CharacterUseCasesProvider = CharacterUseCasesContext.Provider

export function useCharacterUseCases(): CharacterUseCases {
  const context = useContext(CharacterUseCasesContext)
  if (context === null) {
    throw new Error('useCharacterUseCases must be used within a CharacterUseCasesProvider')
  }
  return context
}
