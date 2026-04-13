import { Character, CharacterLink } from '../../domain/Character';
import { CharacterAI } from '../../domain/CharacterAI';
import { CharacterStories } from '../../domain/CharacterStories';
import { CharacterScraper } from '../../domain/CharacterScraper';

export class CharacterStoriesAdapter implements CharacterStories {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly aiService: CharacterAI
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
      const story = await this.aiService.generateCharacterSummary(character);
      return character.withGlobalStory(story);
    } catch {
      return null;
    }
  }
}
