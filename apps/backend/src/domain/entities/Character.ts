export class Character {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly technicalInfo: TechnicalInfo,
    public readonly sections: CharacterSections,
    public readonly image?: string,
    public readonly globalStory?: string
  ) {}

  private static readonly TECHNICAL_INFO_ALIASES: Record<string, string> = {
    amigos: 'mejoresAmigos',
  };

  static fromDetails(details: {
    name: string;
    url: string;
    technicalInfo: TechnicalInfo;
    sections: CharacterSections;
    image?: string;
  }): Character {
    const normalizedInfo: TechnicalInfo = {};
    for (const [key, value] of Object.entries(details.technicalInfo)) {
      const canonicalKey = Character.TECHNICAL_INFO_ALIASES[key] ?? key;
      normalizedInfo[canonicalKey] = value;
    }
    return new Character(details.name, details.url, normalizedInfo, details.sections, details.image);
  }

  withGlobalStory(story: string): Character {
    return new Character(this.name, this.url, this.technicalInfo, this.sections, this.image, story);
  }

  getFlatContent(): string {
    return Object.entries(this.sections)
      .map(([sectionName, subsections]) => this.flattenSection(sectionName, subsections))
      .join('\n');
  }

  isEmpty(): boolean {
    const hasTechnicalInfo = Object.keys(this.technicalInfo).length > 0;
    const hasSections = Object.keys(this.sections).length > 0;
    const hasImage = !!this.image;
    return !hasTechnicalInfo && !hasSections && !hasImage;
  }

  hasFriends(): boolean {
    return !!this.technicalInfo.mejoresAmigos?.trim();
  }

  private flattenSection(sectionName: string, subsections: Section): string {
    return Object.entries(subsections)
      .map(([title, content]) => {
        const paragraphs = Array.isArray(content) ? content : content.original;
        return `\n--- INFO ${sectionName.toUpperCase()} (${title.toUpperCase()}): ---\n${paragraphs.join(' ')}`;
      })
      .join('');
  }
}

export interface CharacterLink {
  name: string;
  url: string;
}

export interface TechnicalInfo {
  [key: string]: string;
}

export type SectionContent = string[];

export interface SubsectionDetail {
  childFriendlySummary?: string;
  original: SectionContent;
}

export interface Section {
  [subsectionName: string]: SectionContent | SubsectionDetail;
}

export interface CharacterSections {
  [sectionName: string]: Section;
}
