import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../../config/config';
import { Character, CharacterLink, CharacterSections, Section, TechnicalInfo } from '../../domain/Character';
import { CharacterScraper } from '../../domain/CharacterScraper';

export class WikiScraper implements CharacterScraper {
  private readonly httpClient: AxiosInstance;

  constructor(httpClient?: AxiosInstance) {
    this.httpClient = httpClient || axios;
  }

  async getCharacterList(): Promise<CharacterLink[]> {
    try {
      const { data } = await this.httpClient.get(config.urls.charactersCategory);
      const $ = cheerio.load(data.parse.text['*']);

      return $('.lightbox-caption')
        .map((_, element) => this.parseCharacterLink($, element))
        .get()
        .filter((link) => link.name && link.url);
    } catch (error: any) {
      throw new Error(`Failed to fetch character list: ${error.message}`);
    }
  }

  private parseCharacterLink($: cheerio.CheerioAPI, element: any): CharacterLink {
    const anchor = $(element).find('a');

    const name = $(anchor).text().trim();
    const path = $(anchor).attr('href') || '';
    let characterName = path.split('/').pop();
    if (!characterName) return { name, url: '' };
    if (name === 'Cleo de Nilo') {
      characterName = 'Cleo_de_Nile';
    }
    const url = config.urls.charactersDetails.replace('${characterName}', characterName);

    return { name, url };
  }

  async getCharacterDetails(url: string): Promise<Character | null> {
    try {
      const { data } = await this.httpClient.get(url);
      const $ = cheerio.load(data.parse.text['*']);

      const name = data.parse.title || 'Unknown';
      const image = $('.pi-image-thumbnail').attr('src');

      return Character.fromDetails({
        name,
        url,
        image: image || undefined,
        technicalInfo: this.parseTechnicalInfo($),
        sections: this.parseSections($),
      });
    } catch {
      return null;
    }
  }

  private parseTechnicalInfo($: cheerio.CheerioAPI): TechnicalInfo {
    const info: TechnicalInfo = {};
    $('.pi-item.pi-data').each((_, el) => {
      const label = $(el).find('.pi-data-label').text().trim().replace(/:/g, '');
      const valueContainer = $(el).find('.pi-data-value');
      const children = valueContainer.children();
      let value;

      if (children.length > 0) {
        value = children
          .map((_, child) => $(child).text().trim())
          .get()
          .filter((txt) => txt.length > 0)
          .join(', ');
      } else {
        value = valueContainer.text().trim();
      }

      if (label && value) {
        const key = this.toCamelCase(label);
        info[key] = value;
      }
    });
    return info;
  }

  private parseSections($: cheerio.CheerioAPI): CharacterSections {
    const sections: CharacterSections = {};
    const excludedSections = ['Gallery', 'Galería', 'Referencias', 'References'];

    $('h2').each((_, elH2) => {
      const sectionName = $(elH2).find('span.mw-headline').attr('id');
      if (!sectionName || excludedSections.includes(sectionName)) return;

      const key = this.toCamelCase(sectionName);
      const content = this.parseSectionContent($, elH2);

      if (Object.keys(content).length > 0) {
        sections[key] = content;
      }
    });

    return sections;
  }

  private parseSectionContent($: cheerio.CheerioAPI, heading: any): Section {
    const section: Section = {};
    let cursor = $(heading).next();

    while (cursor.length > 0 && (cursor[0] as any).name !== 'h2') {
      const element = cursor[0] as any;

      if (element.name === 'h3') {
        this.parseSubsection($, cursor, section);
      } else if (element.name === 'p') {
        this.addGeneralParagraph($, cursor, section);
      }

      cursor = cursor.next();
    }

    return section;
  }

  private parseSubsection(_$: cheerio.CheerioAPI, heading: cheerio.Cheerio<any>, section: Section): void {
    // Try to get text from span.mw-headline first (real Fandom HTML), fallback to heading text if not found
    const headlineSpan = heading.find('span.mw-headline').text().trim();
    const title = this.toCamelCase(headlineSpan || heading.text().trim());
    const paragraphs: string[] = [];
    let cursor = heading.next();

    while (cursor.length > 0 && !['h2', 'h3'].includes((cursor[0] as any).name)) {
      if ((cursor[0] as any).name === 'p') {
        const text = cursor
          .text()
          .trim()
          .replace(/\[\d+\]/g, '');
        if (text) paragraphs.push(text);
      }
      cursor = cursor.next();
    }

    if (paragraphs.length > 0) {
      section[title] = paragraphs;
    }
  }

  private addGeneralParagraph(_$: cheerio.CheerioAPI, cursor: cheerio.Cheerio<any>, section: Section): void {
    const text = cursor
      .text()
      .trim()
      .replace(/\[\d+\]/g, '');
    if (!text) return;

    if (!section.general) {
      section.general = [];
    }
    (section.general as string[]).push(text);
  }

  private toCamelCase(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^(.)/, (_, char) => char.toLowerCase())
      .trim();
  }
}
