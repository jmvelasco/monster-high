import { useCallback, useState } from 'react'

import { useDebounce } from '../../../shared/infrastructure/hooks/useDebounce'
import { FilterCharactersByNameUseCase } from '../../application/FilterCharactersByNameUseCase'
import { useCharactersQuery } from './Character.queries'

const filterUseCase = new FilterCharactersByNameUseCase()

export function useCharacterSearch() {
  const query = useCharactersQuery()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedQuery = useDebounce(searchTerm, 300)

  const filteredCharacters = useCallback(
    () => filterUseCase.execute(query.characters(), debouncedQuery),
    [query, debouncedQuery]
  )

  const resetSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    resetSearch,
    filteredCharacters,
    isLoading: query.isLoading,
    errorMessage: query.errorMessage,
  }
}
