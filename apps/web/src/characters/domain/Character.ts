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

export interface CharacterSections {
  personaje?: CharacterSection
  monstruoClasico?: CharacterSection
  relaciones?: CharacterSection
  habilidades?: CharacterSection
  [sectionName: string]: CharacterSection | undefined
}

export interface TechnicalInfo {
  edad?: string
  sexo?: string
  ocupacion?: string
  mascota?: string
  familiares?: string
  mejoresAmigos?: string
}

export interface Character {
  name: string
  url: string
  technicalInfo: TechnicalInfo
  sections: CharacterSections
  image?: string
  globalStory?: string
}
