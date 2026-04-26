import { GenerateCharacterCatalogUseCase } from './application/GenerateCharacterCatalogUseCase';
import { ConsoleLogger } from './infrastructure/logger/ConsoleLogger';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { GroqStoryGenerator } from './infrastructure/story-generator/GroqStoryGenerator';

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
  const logger = new ConsoleLogger();
  const storyGenerator = new GroqStoryGenerator();
  const repository = new JsonRepository();
  const useCase = new GenerateCharacterCatalogUseCase(scraper, storyGenerator, repository, logger);

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
