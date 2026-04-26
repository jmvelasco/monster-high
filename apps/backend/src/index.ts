import { GenerateCharacterCatalogUseCase } from './application/GenerateCharacterCatalogUseCase';
import { RunFizzBuzzUseCase } from './application/RunFizzBuzzUseCase';
import { ColoredConsoleFizzBuzzPresenter } from './infrastructure/fizzbuzz/ColoredConsoleFizzBuzzPresenter';
import { ConsoleLogger } from './infrastructure/logger/ConsoleLogger';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { GroqStoryGenerator } from './infrastructure/story-generator/GroqStoryGenerator';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function runFizzBuzz(min?: number, max?: number): void {
  const presenter = new ColoredConsoleFizzBuzzPresenter();
  const useCase = new RunFizzBuzzUseCase(presenter);

  if (min !== undefined && max !== undefined) {
    useCase.execute(min, max);
    return;
  }
  if (min !== undefined) {
    useCase.execute(0, min);
    return;
  }
  useCase.execute();
}

async function runPipeline(character?: string): Promise<void> {
  const scraper = new WikiScraper();
  const logger = new ConsoleLogger();
  const storyGenerator = new GroqStoryGenerator();
  const repository = new JsonRepository();
  const useCase = new GenerateCharacterCatalogUseCase(scraper, storyGenerator, repository, logger);

  logger.log('🚀 Starting Monster High Publisher');
  try {
    await useCase.execute(character);
    logger.log('\n🎉 Pipeline completed successfully!');
  } catch (error) {
    logger.error(`Critical Error in Pipeline: ${error}`);
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command(
    'fizzbuzz [min] [max]',
    'Run FizzBuzz for a given range',
    (y) =>
      y
        .positional('min', { type: 'number', description: 'Start of range' })
        .positional('max', { type: 'number', description: 'End of range' }),
    (argv) => runFizzBuzz(argv.min, argv.max)
  )
  .command(
    'pipeline',
    'Run the Monster High character pipeline',
    (y) =>
      y.option('character', {
        type: 'string',
        description: 'Name of the character to process',
      }),
    (argv) => runPipeline(argv.character)
  )
  .demandCommand(1, 'Please specify a command: fizzbuzz or pipeline')
  .strict()
  .help()
  .parseAsync();
