import { Character } from '../domain/Character';
import { CharacterEnricher } from '../domain/CharacterEnricher';
import { CharacterRepository } from '../domain/CharacterRepository';
import { Logger } from '../domain/Logger';

export class PublishCharactersUseCase {
  constructor(
    private readonly enricher: CharacterEnricher,
    private readonly repository: CharacterRepository,
    private readonly logger: Logger
  ) {}

  async execute(targetCharacterName?: string): Promise<void> {
    const characterLinks = await this.enricher.scrapeCharacterLinks();

    const linksToProcess = targetCharacterName
      ? characterLinks.filter((link) => link.name === targetCharacterName)
      : characterLinks;

    this.logger.console(`📋 Found ${linksToProcess.length} characters.`);

    const publishedCharacters: Character[] = [];

    for (const [index, link] of linksToProcess.entries()) {
      this.logger.console(`\n ▶️ [${index + 1}/${linksToProcess.length}] Publishing: ${link.name}`);

      const enriched = await this.enricher.scrapeAndEnrich(link.url);

      if (!enriched) {
        this.logger.console(`⚠️ Skipping ${link.name} (Not found).`);
        continue;
      }

      publishedCharacters.push(enriched);

      await this.repository.saveAll(publishedCharacters);
    }
  }
}
