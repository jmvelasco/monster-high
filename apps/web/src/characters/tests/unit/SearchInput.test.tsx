import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SearchInput } from '../../infrastructure/ui/SearchInput/SearchInput'

describe('SearchInput', () => {
  it("renderiza un campo de texto con placeholder 'Buscar personaje...'", () => {
    render(<SearchInput value="" onChange={vi.fn()} onReset={vi.fn()} />)

    expect(
      screen.getByPlaceholderText('Buscar personaje...')
    ).toBeInTheDocument()
  })

  it('el input tiene un label accesible', () => {
    render(<SearchInput value="" onChange={vi.fn()} onReset={vi.fn()} />)

    expect(screen.getByRole('searchbox', { name: /buscar/i })).toBeInTheDocument()
  })

  it('el botón de reset NO está visible cuando value es cadena vacía', () => {
    render(<SearchInput value="" onChange={vi.fn()} onReset={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: /limpiar/i })
    ).not.toBeInTheDocument()
  })

  it('el botón de reset SÍ está visible cuando value tiene contenido', () => {
    render(<SearchInput value="dracu" onChange={vi.fn()} onReset={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: /limpiar/i })
    ).toBeInTheDocument()
  })

  it('al hacer clic en el botón de reset se invoca la prop onReset', async () => {
    const onReset = vi.fn()

    render(<SearchInput value="dracu" onChange={vi.fn()} onReset={onReset} />)

    await userEvent.click(screen.getByRole('button', { name: /limpiar/i }))

    expect(onReset).toHaveBeenCalledOnce()
  })

  it('al escribir en el input se invoca onChange con el nuevo valor', async () => {
    const onChange = vi.fn()

    render(<SearchInput value="" onChange={onChange} onReset={vi.fn()} />)

    await userEvent.type(screen.getByRole('searchbox'), 'd')

    expect(onChange).toHaveBeenCalledWith('d')
  })

  it("el botón de reset tiene aria-label 'Limpiar búsqueda'", () => {
    render(<SearchInput value="dracu" onChange={vi.fn()} onReset={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Limpiar búsqueda' })
    ).toBeInTheDocument()
  })
})
