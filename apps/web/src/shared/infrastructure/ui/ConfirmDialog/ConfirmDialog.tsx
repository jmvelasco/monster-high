import { useEffect, useRef } from 'react'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (props.isOpen && !dialog.open) {
      dialog.showModal()
    }

    if (!props.isOpen && dialog.open) {
      dialog.close()
    }
  }, [props.isOpen])

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={props.onCancel}>
      <h2 className={styles.title}>{props.title}</h2>
      <p className={styles.message}>{props.message}</p>
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={props.onCancel}>
          {props.cancelText ?? 'Cancelar'}
        </button>
        <button className={styles.confirmButton} onClick={props.onConfirm}>
          {props.confirmText ?? 'Confirmar'}
        </button>
      </div>
    </dialog>
  )
}
