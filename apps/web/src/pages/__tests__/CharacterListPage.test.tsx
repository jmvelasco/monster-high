import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { Character } from '../../types/character';
import { CharacterListPage } from '../CharacterListPage';
import * as useCharactersModule from '../../hooks/useCharacters';

vi.mock('../../hooks/useCharacters');

describe('CharacterListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('muestra loading state mientras carga', () => {
    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<CharacterListPage />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('renderiza CharacterGrid con personajes', () => {
    const mockCharacters: Character[] = [
      { name: 'Draculaura', image: 'draculaura.jpg', sections: {}, url: '', technicalInfo: {} },
      { name: 'Clawdeen', image: 'clawdeen.jpg', sections: {}, url: '', technicalInfo: {} },
    ];

    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Draculaura')).toBeInTheDocument();
    expect(screen.getByAltText('Clawdeen')).toBeInTheDocument();
  });

  it('muestra error state si fetch falla', () => {
    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: undefined,
      error: new Error('Failed to fetch'),
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <CharacterListPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
