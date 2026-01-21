import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Character } from '../../types/character';
import { CharacterListPage } from '../CharacterListPage';
import * as useCharactersModule from '../../hooks/useCharacters';

vi.mock('../../hooks/useCharacters');
vi.mock('../../components/character/CharacterGrid');

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

  it('renderiza CharacterGrid con personajes', () => {
    const mockCharacters: Character[] = [
      { name: 'Draculaura', image: '', sections: {}, url: '', technicalInfo: {} },
      { name: 'Clawdeen', image: '', sections: {}, url: '', technicalInfo: {} },
    ];

    vi.mocked(useCharactersModule.useCharacters).mockReturnValue({
      data: mockCharacters,
      error: undefined,
      isLoading: false,
    });

    const CharacterGrid = vi.fn(() => <div>Mocked CharacterGrid</div>);
    vi.mocked(require('../../components/character/CharacterGrid')).CharacterGrid = CharacterGrid;

    render(<CharacterListPage />);

    expect(CharacterGrid).toHaveBeenCalledWith(
      expect.objectContaining({ characters: mockCharacters }),
      expect.anything()
    );
  });
});
