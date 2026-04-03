import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header} aria-label="Navegación principal">
      <div className={styles.headerContent}>
        <NavLink to="/" className={styles.logo}>
          <img
            src="/images/monster-high-logo.png"
            alt="Monster High Logo"
            width={330}
            height={330}
          />
          <img
            src="/images/monster-high-logo-no-text.png"
            alt="Monster High Logo"
            width={64}
            height={64}
          />
        </NavLink>

        <nav className={styles.nav}>
          <NavLink to="/favorites" className={styles.navLink}>
            ❤️ Mis Favoritos
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
