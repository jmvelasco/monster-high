import { useCharacters } from '../hooks/useCharacters'
import { CharacterGrid } from '../components/character/CharacterGrid'

export function CharacterListPage() {
  const { data, error, isLoading } = useCharacters()

  if (isLoading) {
    return <div>Cargando personajes...</div>
  }

  if (error) {
    return <div>Error al cargar personajes</div>
  }

  return <CharacterGrid characters={data || []} />
}
