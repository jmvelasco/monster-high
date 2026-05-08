import { Character } from '../entities/Character';

export interface CharacterStoryGenerator {
  generateStory(character: Character): Promise<string>;
}
