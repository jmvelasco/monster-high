import { NavLink } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

export function Header() {
  const isMobile = useIsMobile()

  return (
    <header aria-label="Navegación principal">
      <h1>Monster High</h1>
      {isMobile && (
        <button aria-label="Abrir menú de navegación">
          Abrir menú
        </button>
      )}
      <NavLink to="/characters">Todos los Personajes</NavLink>
      <NavLink to="/favorites">Favoritos</NavLink>
    </header>
  )
}
