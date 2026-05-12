import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { FindCharacterBySlugUseCase } from '../../../characters/application/FindCharacterBySlugUseCase'
import type { ListCharactersUseCase } from '../../../characters/application/ListCharactersUseCase'
import { CharacterUseCasesProvider } from '../../../characters/infrastructure/context/CharacterUseCases.context'

interface CharacterUseCases {
  list: ListCharactersUseCase
  findBySlug: FindCharacterBySlugUseCase
}

interface AppProvidersProps {
  characterUseCases: CharacterUseCases
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders(props: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CharacterUseCasesProvider value={props.characterUseCases}>
        {props.children}
      </CharacterUseCasesProvider>
    </QueryClientProvider>
  )
}
