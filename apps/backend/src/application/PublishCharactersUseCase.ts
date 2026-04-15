import { Character } from '../domain/Character';
import { CharacterAI } from '../domain/CharacterAI';
import { CharacterRepository } from '../domain/CharacterRepository';
import { CharacterScraper } from '../domain/CharacterScraper';
import { Logger } from '../domain/Logger';

export class PublishCharactersUseCase {
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

    this.logger.log(`📋 Found ${linksToProcess.length} characters.`);

    const publishedCharacters: Character[] = [];

    for (const [index, link] of linksToProcess.entries()) {
      this.logger.log(`\n ▶️ [${index + 1}/${linksToProcess.length}] Publishing: ${link.name}`);

      const character = await this.scraper.getCharacterDetails(link.url);

      if (!character) {
        this.logger.log(`⚠️ Skipping ${link.name} (Not found).`);
        continue;
      }

      const enriched = await this.enrichWithStory(character);

      if (!enriched) {
        this.logger.log(`⚠️ Skipping ${link.name} (Story generation failed).`);
        continue;
      }

      publishedCharacters.push(enriched);
      await this.repository.saveAll(publishedCharacters);
    }
  }

  private async enrichWithStory(character: Character): Promise<Character | null> {
    try {
      const story = await this.aiService.generateCharacterSummary(character);
      return character.withGlobalStory(story);
    } catch {
      return null;
    }
  }
}
