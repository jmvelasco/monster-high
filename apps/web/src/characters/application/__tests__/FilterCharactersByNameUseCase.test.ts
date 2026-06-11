import type { Character } from '../../domain/entities/Character'
import { FilterCharactersByNameUseCase } from '../FilterCharactersByNameUseCase'

const makeCharacter = (name: string): Character => ({
  name,
  url: `https://example.com/${name.toLowerCase()}`,
  technicalInfo: {},
  sections: {},
})

describe('FilterCharactersByNameUseCase', () => {
  const useCase = new FilterCharactersByNameUseCase()

  const characters: Character[] = [
    makeCharacter('Draculaura'),
    makeCharacter('Clawdeen Wolf'),
    makeCharacter('Frankie Stein'),
  ]

  it('devuelve todos los personajes cuando el query es cadena vacía', () => {
    const result = useCase.execute(characters, '')

    expect(result).toEqual(characters)
  })

  it('devuelve todos los personajes cuando el query contiene solo espacios en blanco', () => {
    const result = useCase.execute(characters, '   ')

    expect(result).toEqual(characters)
  })

  it('filtra por substring parcial del nombre', () => {
    const result = useCase.execute(characters, 'dracu')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Draculaura')
  })

  it('la comparación es case-insensitive', () => {
    const result = useCase.execute(characters, 'DRACULAURA')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Draculaura')
  })

  it('devuelve array vacío cuando ningún personaje coincide con el criterio', () => {
    const result = useCase.execute(characters, 'xyz-no-match')

    expect(result).toEqual([])
  })

  it('aplica trim al query antes de comparar', () => {
    const result = useCase.execute(characters, '  Draculaura  ')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Draculaura')
  })
})
