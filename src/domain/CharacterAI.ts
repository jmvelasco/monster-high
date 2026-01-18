import { Character } from './Character';

export interface CharacterAI {
  generateCharacterSummary(character: Character): Promise<string>;
}
