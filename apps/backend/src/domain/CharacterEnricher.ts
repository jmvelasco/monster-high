import { Character, CharacterLink } from './Character';

export interface CharacterEnricher {
  scrapeCharacterLinks(): Promise<CharacterLink[]>;
  scrapeAndEnrich(url: string): Promise<Character | null>;
}
