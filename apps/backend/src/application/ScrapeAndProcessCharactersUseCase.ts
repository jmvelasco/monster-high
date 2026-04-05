import { setTimeout } from 'node:timers/promises';
import { config } from '../config/config';
import { Character } from '../domain/Character';
import { CharacterAI } from '../domain/CharacterAI';
import { CharacterRepository } from '../domain/CharacterRepository';
import { CharacterScraper } from '../domain/CharacterScraper';

export class ScrapeAndProcessCharactersUseCase {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly aiService: CharacterAI,
    private readonly repository: CharacterRepository
  ) {}

  async execute(): Promise<void> {
    const characterLinks = await this.scraper.getCharacterList();
    console.log(`📋 Found ${characterLinks.length} characters.`);

    const processedCharacters: Character[] = [];

    for (const [index, link] of characterLinks.entries()) {
      console.log(`\n ▶️  [${index + 1}/${characterLinks.length}] Processing: ${link.name}`);

      const character = await this.scraper.getCharacterDetails(link.url);

      if (!character) {
        console.warn(`⚠️ Skipping ${link.name} (No details found).`);
        continue;
      }

      const enriched = await this.enrichWithStory(character);
      processedCharacters.push(enriched);

      await this.repository.saveAll(processedCharacters);
      await setTimeout(config.scraping.rateLimitDelay);
    }
  }

  private async enrichWithStory(character: Character): Promise<Character> {
    console.log(`   ✨ Generating magic story for ${character.name}...`);
    const story = await this.aiService.generateCharacterSummary(character);
    return character.withGlobalStory(story);
  }
}
