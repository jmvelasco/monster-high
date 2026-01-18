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

export class Character {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly technicalInfo: TechnicalInfo,
    public readonly sections: CharacterSections,
    public readonly image?: string,
    public readonly globalStory?: string
  ) {}

  static fromDetails(details: {
    name: string;
    url: string;
    technicalInfo: TechnicalInfo;
    sections: CharacterSections;
    image?: string;
  }): Character {
    return new Character(details.name, details.url, details.technicalInfo, details.sections, details.image);
  }

  withGlobalStory(story: string): Character {
    return new Character(this.name, this.url, this.technicalInfo, this.sections, this.image, story);
  }

  getFlatContent(): string {
    return Object.entries(this.sections)
      .map(([sectionName, subsections]) => this.flattenSection(sectionName, subsections))
      .join('\n');
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
