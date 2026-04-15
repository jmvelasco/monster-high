import { Character, CharacterLink } from './Character';

export interface CharacterStories {
  scrapeCharacterLinks(): Promise<CharacterLink[]>;
  scrapeAndEnrich(url: string): Promise<Character | null>;
}
