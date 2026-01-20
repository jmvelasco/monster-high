/**
 * Subsecciones dentro de cada sección principal
 */
export interface CharacterSection {
  general?: string[]
  apariencia?: string[]
  personalidad?: string[]
  amigos?: string[]
  familia?: string[]
  mascota?: string[]
  romance?: string[]
  [key: string]: string[] | undefined
}

/**
 * Secciones principales del personaje
 */
export interface CharacterSections {
  personaje?: CharacterSection
  monstruoClasico?: CharacterSection
  relaciones?: CharacterSection
  habilidades?: CharacterSection
  [sectionName: string]: CharacterSection | undefined
}

/**
 * Información técnica del personaje
 */
export interface TechnicalInfo {
  edad?: string
  sexo?: string
  ocupacion?: string
  mascota?: string
  familiares?: string
  mejoresAmigos?: string
}

/**
 * Personaje de Monster High
 */
export interface Character {
  name: string
  url: string
  technicalInfo: TechnicalInfo
  sections: CharacterSections
  image?: string
  globalStory?: string
}
