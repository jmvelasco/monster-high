import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCharacters } from '../useCharacters';

describe('useCharacters', () => {
  it('retorna loading state inicialmente', () => {
    const { result } = renderHook(() => useCharacters());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });
});
