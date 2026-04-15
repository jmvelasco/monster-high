import { Character } from '../domain/Character';
import { CharacterRepository } from '../domain/CharacterRepository';
import { CharacterStories } from '../domain/CharacterStories';
import { Logger } from '../domain/Logger';

export class PublishCharactersUseCase {
  constructor(
    private readonly stories: CharacterStories,
    private readonly repository: CharacterRepository,
    private readonly logger: Logger
  ) {}

  async execute(targetCharacterName?: string): Promise<void> {
    const characterLinks = await this.stories.scrapeCharacterLinks();

    const linksToProcess = targetCharacterName
      ? characterLinks.filter((link) => link.name === targetCharacterName)
      : characterLinks;

    this.logger.log(`📋 Found ${linksToProcess.length} characters.`);

    const publishedCharacters: Character[] = [];

    for (const [index, link] of linksToProcess.entries()) {
      this.logger.log(`\n ▶️ [${index + 1}/${linksToProcess.length}] Publishing: ${link.name}`);

      const enriched = await this.stories.scrapeAndEnrich(link.url);

      if (!enriched) {
        this.logger.log(`⚠️ Skipping ${link.name} (Not found).`);
        continue;
      }

      publishedCharacters.push(enriched);

      await this.repository.saveAll(publishedCharacters);
    }
  }
}
