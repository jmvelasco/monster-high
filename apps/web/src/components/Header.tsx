import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header>
      <h1>Monster High</h1>
      <NavLink to="/characters">Todos los Personajes</NavLink>
      <NavLink to="/favorites">Favoritos</NavLink>
    </header>
  )
}
