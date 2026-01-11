import { CharacterLink, Character } from './Character';

export interface CharacterScraper {
    getCharacterList(): Promise<CharacterLink[]>;
    getCharacterDetails(url: string): Promise<Character | null>;
}
