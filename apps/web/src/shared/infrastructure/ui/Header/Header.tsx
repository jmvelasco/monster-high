import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
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
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
          />
        </NavLink>

        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/friends" className={styles.navLink}>
            <span aria-hidden="true">💜</span> Mis Amigas
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
