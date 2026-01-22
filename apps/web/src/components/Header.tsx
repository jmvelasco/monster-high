import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header>
      <h1>Monster High</h1>
      <Link to="/characters">Todos los Personajes</Link>
    </header>
  )
}
