import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'
import styles from './Header.module.css'

export function Header() {
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header} aria-label="Navegación principal">
      <div className={styles.headerContent}>
        <NavLink to="/" className={styles.logo}>
          Monster High
        </NavLink>
        {isMobile && (
          <button className={styles.hamburger} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}>
            <span />
            <span />
            <span />
          </button>
        )}
        {isMobile && isMenuOpen ? (
          <nav className={styles.navMobile}>
            <NavLink to="/characters" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Todos los Personajes
            </NavLink>
            <NavLink to="/favorites" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
              Favoritos
            </NavLink>
          </nav>
        ) : isMobile ? null : (
          <nav className={styles.nav}>
            <NavLink to="/characters" className={styles.navLink}>
              Todos los Personajes
            </NavLink>
            <NavLink to="/favorites" className={styles.navLink}>
              Favoritos
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}
