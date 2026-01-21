import { useCharacters } from '../hooks/useCharacters';

export function CharacterListPage() {
  const { isLoading } = useCharacters();

  if (isLoading) {
    return <div>Cargando personajes...</div>;
  }

  return <div>CharacterListPage</div>;
}
