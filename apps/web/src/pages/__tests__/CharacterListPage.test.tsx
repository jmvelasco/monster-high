import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CharacterListPage } from '../CharacterListPage';
import * as useCharactersModule from '../../hooks/useCharacters';

vi.mock('../../hooks/useCharacters');

describe('CharacterListPage', () => {
  it('muestra loading state mientras carga', () => {
    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<CharacterListPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
