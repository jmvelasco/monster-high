import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from '../../infrastructure/ui/Footer/Footer'

describe('Footer', () => {
  it('renderiza el landmark semántico footer', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('tiene aria-label descriptivo en el footer', () => {
    render(<Footer />)

    expect(
      screen.getByRole('contentinfo', { name: 'Información del proyecto' })
    ).toBeInTheDocument()
  })

  it('muestra la dedicatoria a Cloe', () => {
    render(<Footer />)

    expect(screen.getByText(/Cloe/i)).toBeInTheDocument()
  })

  it('muestra la motivación de práctica deliberada', () => {
    render(<Footer />)

    expect(screen.getByText(/práctica deliberada/i)).toBeInTheDocument()
  })

  it('muestra el año en el copyright', () => {
    render(<Footer />)

    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })
})
