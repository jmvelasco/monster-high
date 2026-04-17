import { Character, CharacterLink } from '../../domain/Character';
import { CharacterScraper } from '../../domain/CharacterScraper';
import { CharacterStories } from '../../domain/CharacterStories';
import { CharacterStoryGenerator } from '../../domain/CharacterStoryGenerator';

export class CharacterStoriesAdapter implements CharacterStories {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly aiService: CharacterStoryGenerator
  ) {}

  async scrapeCharacterLinks(): Promise<CharacterLink[]> {
    return this.scraper.getCharacterList();
  }

  async scrapeAndEnrich(url: string): Promise<Character | null> {
    const character = await this.scraper.getCharacterDetails(url);
    if (!character) {
      return null;
    }

    try {
      const story = await this.aiService.generateStory(character);
      return character.withGlobalStory(story);
    } catch {
      return null;
    }
  }
}
