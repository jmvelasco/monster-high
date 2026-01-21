import { useCharacters } from '../hooks/useCharacters';
import { CharacterGrid } from '../components/character/CharacterGrid';

export function CharacterListPage() {
  const { data, isLoading } = useCharacters();

  if (isLoading) {
    return <div>Cargando personajes...</div>;
  }

  return <CharacterGrid characters={data || []} />;
}
