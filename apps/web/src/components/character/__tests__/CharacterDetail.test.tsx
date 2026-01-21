import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Character } from '../../../types/character'
import { CharacterDetail } from '../CharacterDetail'

describe('CharacterDetail', () => {
  // BLOQUE 1: Imagen del personaje
  
  // TODO: Test 1 - Muestra imagen del personaje con alt text (IN PROGRESS)
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

  // TODO: Test 2 - Muestra placeholder si imagen es undefined (IN PROGRESS)
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

  // BLOQUE 2: Ficha técnica (4 tests)
  
  // TODO: Test 3 - Muestra todos los campos de technicalInfo presentes (IN PROGRESS)
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

  // TODO: Test 4 - Maneja campos opcionales (undefined) sin romper UI (IN PROGRESS)
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

  // TODO: Test 5 - Maneja campos vacíos ("") sin mostrarlos (IN PROGRESS)
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

  // TODO: Test 6 - Formatea labels correctamente (capitalización) (IN PROGRESS)
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
  
  // TODO: Test 7 - Renderiza globalStory con fuente Gruenewald VA (IN PROGRESS)
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
    expect(story).toHaveClass('global-story')
  })

  // TODO: Test 8 - Muestra placeholder si globalStory es undefined (IN PROGRESS)
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

  // TODO: Test 9 - Muestra placeholder si globalStory es "" (IN PROGRESS)
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

  // BLOQUE 4: Layout responsive
  // BLOQUE 3: Historia (3 tests)
  // BLOQUE 4: Layout responsive (2 tests)
  // BLOQUE 5: Navegación (1 test)
})
