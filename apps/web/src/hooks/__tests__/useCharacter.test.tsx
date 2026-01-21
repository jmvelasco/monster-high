import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { useCharacter } from '../useCharacter'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
)

describe('useCharacter', () => {
  // TODO: Test 1 - Retorna personaje por slug (IN PROGRESS)
  it('retorna personaje por slug', async () => {
    // Arrange
    const slug = 'draculaura'

    // Act
    const { result } = renderHook(() => useCharacter(slug), { wrapper })

    // Assert
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('Draculaura')
    })
  })

  // TODO: Test 2 - Retorna undefined si slug no existe
  // TODO: Test 3 - Maneja loading state
})
