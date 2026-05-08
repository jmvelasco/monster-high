import { Character, CharacterLink } from '../entities/Character';

export interface CharacterScraper {
  getCharacterList(): Promise<CharacterLink[]>;
  getCharacterDetails(url: string): Promise<Character | null>;
}
