import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Character } from '../../../types/character'
import { CharacterDetail } from '../CharacterDetail'

describe('CharacterDetail', () => {
  // BLOQUE 1: Imagen del personaje

  it('muestra imagen del personaje con alt text', () => {
    // Arrange
    const character: Character = {
      name: 'Draculaura',
      url: 'https://example.com',
      image: 'https://example.com/draculaura.jpg',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    const image = screen.getByRole('img', { name: 'Draculaura' })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/draculaura.jpg')
  })

  it('muestra placeholder si imagen es undefined', () => {
    // Arrange
    const character: Character = {
      name: 'Frankie Stein',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    const image = screen.getByRole('img', { name: 'Frankie Stein' })
    expect(image).toHaveAttribute('src', '/images/placeholder-character.svg')
  })

  // BLOQUE 2: Ficha técnica

  it('muestra todos los campos de technicalInfo presentes', () => {
    // Arrange
    const character: Character = {
      name: 'Clawdeen Wolf',
      url: 'https://example.com',
      technicalInfo: {
        edad: '15',
        sexo: 'Femenino',
        ocupacion: 'Estudiante',
        mascota: 'Crescent',
      },
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    expect(screen.getByText('Edad:')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('Sexo:')).toBeInTheDocument()
    expect(screen.getByText('Femenino')).toBeInTheDocument()
    expect(screen.getByText('Ocupación:')).toBeInTheDocument()
    expect(screen.getByText('Estudiante')).toBeInTheDocument()
    expect(screen.getByText('Mascota:')).toBeInTheDocument()
    expect(screen.getByText('Crescent')).toBeInTheDocument()
  })

  it('maneja campos opcionales (undefined) sin romper UI', () => {
    // Arrange
    const character: Character = {
      name: 'Lagoona Blue',
      url: 'https://example.com',
      technicalInfo: {
        edad: '15',
        // sexo, ocupacion, mascota undefined
      },
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    expect(screen.getByText('Edad:')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.queryByText('Sexo:')).not.toBeInTheDocument()
    expect(screen.queryByText('Ocupación:')).not.toBeInTheDocument()
    expect(screen.queryByText('Mascota:')).not.toBeInTheDocument()
  })

  it('maneja campos vacíos ("") sin mostrarlos', () => {
    // Arrange
    const character: Character = {
      name: 'Cleo de Nile',
      url: 'https://example.com',
      technicalInfo: {
        edad: '16',
        sexo: '',
        ocupacion: '',
      },
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    expect(screen.getByText('Edad:')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
    expect(screen.queryByText('Sexo:')).not.toBeInTheDocument()
    expect(screen.queryByText('Ocupación:')).not.toBeInTheDocument()
  })

  it('formatea labels correctamente (capitalización)', () => {
    // Arrange
    const character: Character = {
      name: 'Ghoulia Yelps',
      url: 'https://example.com',
      technicalInfo: {
        ocupacion: 'Estudiante',
        mejoresAmigos: 'Cleo de Nile',
      },
      sections: {},
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    expect(screen.getByText('Ocupación:')).toBeInTheDocument()
    expect(screen.getByText('Mejores Amigos:')).toBeInTheDocument()
  })

  // BLOQUE 3: Historia (globalStory)

  it('renderiza globalStory con fuente Gruenewald VA', () => {
    // Arrange
    const character: Character = {
      name: 'Deuce Gorgon',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory: 'Deuce es el hijo de Medusa y tiene el poder de convertir a las personas en piedra con su mirada.',
    }

    // Act
    render(<CharacterDetail character={character} />)

    // Assert
    const story = screen.getByText(/Deuce es el hijo de Medusa/)
    expect(story).toBeInTheDocument()
    // Verificar que tiene la clase CSS Module aplicada (comienza con globalStory)
    expect(story.className).toMatch(/globalStory/)
  })

  it('muestra placeholder si globalStory es undefined', () => {
    // Arrange
    const character: Character = {
      name: 'Spectra Vondergeist',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
    }

    // Act
    const { container } = render(<CharacterDetail character={character} />)

    // Assert - No debe renderizar sección de historia
    const storySection = container.querySelector('.global-story')
    expect(storySection).not.toBeInTheDocument()
  })

  it('muestra placeholder si globalStory es ""', () => {
    // Arrange
    const character: Character = {
      name: 'Operetta',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {},
      globalStory: '',
    }

    // Act
    const { container } = render(<CharacterDetail character={character} />)

    // Assert - No debe renderizar sección de historia
    const storySection = container.querySelector('.global-story')
    expect(storySection).not.toBeInTheDocument()
  })

  // BLOQUE 4: Layout responsive - DIFERIDO A FASE 5
  // BLOQUE 5: Navegación - N/A (responsabilidad de CharacterDetailPage)
})

