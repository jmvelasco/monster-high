import { useParams } from 'react-router-dom'
import { useCharacter } from '../hooks/useCharacter'
import { CharacterDetail } from '../components/character/CharacterDetail'

export function CharacterDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: character, isLoading, error } = useCharacter(slug || '')

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error al cargar personaje</div>
  }

  if (!character) {
    return <div>Personaje no encontrado</div>
  }

  return <CharacterDetail character={character} />
}

