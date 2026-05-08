import { Character } from '../domain/entities/Character';
import { CharacterRepository } from '../domain/ports/CharacterRepository';
import { CharacterScraper } from '../domain/ports/CharacterScraper';
import { CharacterStoryGenerator } from '../domain/ports/CharacterStoryGenerator';
import { Logger } from '../domain/ports/Logger';

export class GenerateCharacterCatalogUseCase {
  constructor(
    private readonly scraper: CharacterScraper,
    private readonly storyGenerator: CharacterStoryGenerator,
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
      if (!character || character.isEmpty()) {
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
      const story = await this.storyGenerator.generateStory(character);
      return character.withGlobalStory(story);
    } catch {
      return null;
    }
  }
}
