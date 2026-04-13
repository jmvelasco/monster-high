import { CharacterEnricher } from '../../domain/CharacterEnricher';
import { Character, CharacterLink } from '../../domain/Character';
import { CharacterScraper } from '../../domain/CharacterScraper';
import { CharacterAI } from '../../domain/CharacterAI';

export class CharacterEnricherAdapter implements CharacterEnricher {
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
