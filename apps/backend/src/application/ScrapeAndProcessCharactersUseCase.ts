import { setTimeout } from 'node:timers/promises';
import { config } from '../config/config';
import { Character } from '../domain/Character';
import { CharacterAI } from '../domain/CharacterAI';
import { CharacterRepository } from '../domain/CharacterRepository';
import { CharacterScraper } from '../domain/CharacterScraper';
import { Level, Logger } from '../domain/Logger';

export class ScrapeAndProcessCharactersUseCase {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly aiService: CharacterAI,
    private readonly repository: CharacterRepository,
    private readonly logger: Logger
  ) {}

  async execute(targetCharacterName?: string): Promise<void> {
    const characterLinks = await this.scraper.getCharacterList();

    const linksToProcess = targetCharacterName
      ? characterLinks.filter((link) => link.name === targetCharacterName)
      : characterLinks;

    this.logger.log(Level.INFO, `Found ${linksToProcess.length} characters.`);

    const processedCharacters: Character[] = [];

    for (const [index, link] of linksToProcess.entries()) {
      this.logger.log(Level.INFO, `[${index + 1}/${linksToProcess.length}] Processing: ${link.name}`);

      const character = await this.scraper.getCharacterDetails(link.url);

      if (!character) {
        this.logger.log(Level.WARN, `Skipping ${link.name} (No details found).`);
        continue;
      }

      const enriched = await this.enrichWithStory(character);
      processedCharacters.push(enriched);

      await this.repository.saveAll(processedCharacters);
      await setTimeout(config.scraping.rateLimitDelay);
    }
  }

  private async enrichWithStory(character: Character): Promise<Character> {
    this.logger.log(Level.INFO, `Generating magic story for ${character.name}...`);
    const story = await this.aiService.generateCharacterSummary(character);
    return character.withGlobalStory(story);
  }
}
