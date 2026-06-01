import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onReset: () => void
}

export function SearchInput(props: SearchInputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.srOnly} htmlFor="character-search">
        Buscar personaje
      </label>
      <input
        id="character-search"
        type="search"
        role="searchbox"
        className={styles.input}
        value={props.value}
        placeholder="Buscar personaje..."
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.value !== '' && (
        <button
          type="button"
          className={styles.resetButton}
          aria-label="Limpiar búsqueda"
          onClick={props.onReset}
        >
          ✕
        </button>
      )}
    </div>
  )
}
