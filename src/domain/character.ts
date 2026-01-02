
export interface CharacterLink {
    nombre: string;
    url: string;
}

export interface CharacterInfo {
    [key: string]: string;
}

// Representa la estructura de parrafos dentro de una subsección
export type SectionContent = string[];

// Representa las subsecciones dentro de una sección principal (H2)
// Ejemplo: "Vida": { "Familia": [...], "Amigos": [...] }
export interface Section {
    [subSectionName: string]: SectionContent | { resumen_infantil?: string, original: SectionContent };
    // _general?: SectionContent; // Para parrafos directos bajo el H2
}

export interface CharacterSections {
    [sectionName: string]: Section;
}

export interface CharacterDetails {
    nombre: string;
    url: string;
    imagen?: string;
    info_tecnica: CharacterInfo;
    secciones: CharacterSections;
}

export interface ProcessedCharacter extends CharacterDetails {
    resumen_global?: string;
}
