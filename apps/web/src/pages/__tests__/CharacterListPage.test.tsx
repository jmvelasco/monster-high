import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CharacterListPage } from '../CharacterListPage';

vi.mock('../../hooks/useCharacters');

describe('CharacterListPage', () => {
  it('muestra loading state mientras carga', () => {
    const { useCharacters } = require('../../hooks/useCharacters');
    useCharacters.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<CharacterListPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
