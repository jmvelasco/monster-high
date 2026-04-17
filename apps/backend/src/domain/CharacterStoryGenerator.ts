import { Character } from './Character';

export interface CharacterStoryGenerator {
  generateStory(character: Character): Promise<string>;
}
