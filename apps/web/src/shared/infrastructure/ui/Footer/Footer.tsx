import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer} aria-label="Información del proyecto">
      <div className={styles.footerContent}>
        <p className={styles.dedication}>Hecho con 💜 para Cloe</p>
        <p className={styles.motivation}>
          Un proyecto de práctica deliberada para aprender construyendo algo que importa.
        </p>
        <p className={styles.copyright}>© 2026 · Monster High Fan Project</p>
      </div>
    </footer>
  )
}
