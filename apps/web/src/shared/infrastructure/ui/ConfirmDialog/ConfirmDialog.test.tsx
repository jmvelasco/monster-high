import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal =
      HTMLDialogElement.prototype.showModal ||
      vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute('open', '')
      })

    HTMLDialogElement.prototype.close =
      HTMLDialogElement.prototype.close ||
      vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute('open')
      })
  })

  it('renders as a native dialog element', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Are you sure?"
        message="This action is irreversible."
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Are you sure?"
        message="This action is irreversible."
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('This action is irreversible.')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const handleConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Group"
        message="Are you sure?"
        confirmText="Yes, delete it"
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: 'Yes, delete it' })
    await user.click(confirmButton)

    expect(handleConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Group"
        message="Are you sure?"
        cancelText="No, wait"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: 'No, wait' })
    await user.click(cancelButton)

    expect(handleCancel).toHaveBeenCalledOnce()
  })
})
