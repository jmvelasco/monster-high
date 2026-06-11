import type { ReactNode } from 'react'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        {props.children}
      </main>
      <Footer />
    </div>
  )
}
