import { ScrapeAndProcessCharactersUseCase } from './application/ScrapeAndProcessCharactersUseCase';
import { AIService } from './infrastructure/ai/AIService';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { JsonRepository } from './infrastructure/storage/JsonRepository';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function runPipeline() {
  console.log('🚀 Starting Monster High Scraper Pipeline (Clean Architecture)...');

  const argv = yargs(hideBin(process.argv))
    .option('character', {
      type: 'string',
      description: 'Name of the character to process',
    })
    .parseSync();

  console.log('Target character:', argv.character || 'All characters');

  const scraper = new WikiScraper();
  const aiService = new AIService();
  const repository = new JsonRepository();

  const useCase = new ScrapeAndProcessCharactersUseCase(scraper, aiService, repository);

  try {
    await useCase.execute(argv.character);
    console.log('\n🎉 Pipeline completed successfully!');
  } catch (error) {
    console.error('🔥 Critical Error in Pipeline:', error);
    process.exit(1);
  }
}

runPipeline();
