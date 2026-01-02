
import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../../config/config';
import { CharacterLink, CharacterDetails, CharacterSections, Section } from '../../domain/character';

export class WikiScraper {
    private httpClient: AxiosInstance;

    constructor(httpClient?: AxiosInstance) {
        this.httpClient = httpClient || axios;
    }

    async getCharacterList(): Promise<CharacterLink[]> {
        console.log(`🔍 Scanning character list from: ${config.urls.charactersCategory}`);
        try {
            const { data } = await this.httpClient.get(config.urls.charactersCategory);
            const $ = cheerio.load(data);
            const personajes: CharacterLink[] = [];

            $(".category-page__member-link").each((_, element) => {
                const nombre = $(element).text().trim();
                const path = $(element).attr("href");

                if (nombre && path) {
                    // Check if path is absolute or relative
                    const fullUrl = path.startsWith('http')
                        ? path
                        : `${config.urls.base}${path}`;

                    personajes.push({
                        nombre: nombre,
                        url: fullUrl,
                    });
                }
            });

            return personajes;
        } catch (error: any) {
            console.error("❌ Error fetching character list:", error.message);
            throw error;
        }
    }

    async getCharacterDetails(url: string): Promise<CharacterDetails | null> {
        try {
            const { data } = await this.httpClient.get(url);
            const $ = cheerio.load(data);

            const nombre = $(".mw-page-title-main").text().trim() || "Desconocido";

            // 1. Infobox (Ficha Técnica)
            const info_tecnica: Record<string, string> = {};
            $(".pi-item.pi-data").each((_, el) => {
                const label = $(el).find(".pi-data-label").text().trim().replace(/:/g, "");
                const value = $(el).find(".pi-data-value").text().trim();

                if (label) {
                    const key = label.toLowerCase().replace(/\s+/g, "_");
                    info_tecnica[key] = value;
                }
            });

            // Imagen de perfil
            const imagen = $(".pi-image-thumbnail").attr("src");

            // 2. Extracción Dinámica basada en los H2
            const secciones: CharacterSections = {};

            $("h2").each((_, elH2) => {
                const spanId = $(elH2).find("span.mw-headline").attr("id");
                // Skip galleries and references
                if (!spanId || ["Gallery", "Galería", "Referencias", "References"].includes(spanId)) return;

                const nombreH2 = spanId.toLowerCase().replace(/\s+/g, "_");
                const currentSection: Section = {};
                let hasContent = false;

                let cursor = $(elH2).next();

                // Safe access to first element
                let currentElement = cursor[0];

                // Recorremos los hermanos del H2 hasta el siguiente H2
                while (currentElement && currentElement.name !== "h2") {

                    // CASO A: Encontramos un H3 (Subsección)
                    if (currentElement.name === "h3") {
                        const nombreH3 = cursor.text().trim().toLowerCase().replace(/\s+/g, "_");
                        const parrafos: string[] = [];
                        let posibleP = cursor.next();
                        let currentP = posibleP[0];

                        // Recogemos párrafos hasta el siguiente encabezado
                        while (currentP && !["h2", "h3"].includes(currentP.name)) {
                            if (currentP.name === "p") {
                                const texto = posibleP.text().trim().replace(/\[\d+\]/g, "");
                                if (texto) parrafos.push(texto);
                            }
                            posibleP = posibleP.next();
                            currentP = posibleP[0];
                        }

                        if (parrafos.length > 0) {
                            currentSection[nombreH3] = parrafos;
                            hasContent = true;
                        }
                    }
                    // CASO B: Párrafos directos bajo el H2 (asignados a '_general')
                    else if (currentElement.name === "p") {
                        const textoDirecto = cursor.text().trim().replace(/\[\d+\]/g, "");
                        if (textoDirecto) {
                            if (!currentSection['_general']) {
                                currentSection['_general'] = [];
                            }
                            const generalArr = currentSection['_general'];
                            if (Array.isArray(generalArr)) {
                                generalArr.push(textoDirecto);
                                hasContent = true;
                            }
                        }
                    }
                    cursor = cursor.next();
                    currentElement = cursor[0];
                }

                // Only add if we found something
                if (hasContent) {
                    secciones[nombreH2] = currentSection;
                }
            });

            return {
                nombre,
                url,
                imagen: imagen || undefined, // Convert null/empty string to undefined
                info_tecnica,
                secciones
            };

        } catch (error: any) {
            console.error(`❌ Error fetching details for ${url}:`, error.message);
            return null;
        }
    }
}
