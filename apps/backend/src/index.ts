import { PublishCharactersUseCase } from './application/PublishCharactersUseCase';
import { AIService } from './infrastructure/ai/AIService';
import { Logger } from './infrastructure/logger/Logger';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { CharacterStoriesAdapter } from './infrastructure/stories/CharacterStoriesAdapter';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function runPipeline() {
  const argv = yargs(hideBin(process.argv))
    .option('character', {
      type: 'string',
      description: 'Name of the character to process',
    })
    .parseSync();

  const scraper = new WikiScraper();
  const silenced = false;
  const logger = new Logger(silenced);
  const aiService = new AIService();
  const repository = new JsonRepository();

  // Composition: stories groups scraper + AI responsibilities
  const stories = new CharacterStoriesAdapter(scraper, aiService);
  const useCase = new PublishCharactersUseCase(stories, repository, logger);

  logger.log('🚀 Starting Monster High Publisher');
  try {
    await useCase.execute(argv.character);
    logger.log('\n🎉 Pipeline completed successfully!');
  } catch (error) {
    logger.error(`Critical Error in Pipeline: ${error}`);
    process.exit(1);
  }
}

runPipeline();
