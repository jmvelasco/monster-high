import type { ReactNode } from 'react'
import { Header } from '../Header/Header'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{props.children}</main>
    </div>
  )
}
