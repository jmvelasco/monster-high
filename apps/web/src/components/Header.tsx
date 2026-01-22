import { NavLink } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import styles from './Header.module.css'

export function Header() {
  const isMobile = useIsMobile()

  return (
    <header className={styles.header} aria-label="Navegación principal">
      <div className={styles.headerContent}>
        <NavLink to="/" className={styles.logo}>
          Monster High
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/characters" className={styles.navLink}>
            Todos los Personajes
          </NavLink>
          <NavLink to="/favorites" className={styles.navLink}>
            Favoritos
          </NavLink>
        </nav>
        {isMobile && (
          <button className={styles.hamburger} aria-label="Abrir menú de navegación">
            <span />
            <span />
            <span />
          </button>
        )}
      </div>
    </header>
  )
}
