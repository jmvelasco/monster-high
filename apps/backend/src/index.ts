import { hideBin } from 'yargs/helpers';
import { GenerateCharacterCatalogUseCase } from './application/GenerateCharacterCatalogUseCase';
import { RunFizzBuzzUseCase } from './application/RunFizzBuzzUseCase';
import { config } from './config/config';
import { CommandLineProcessor } from './infrastructure/cli/CommandLineProcessor';
import { YargsCliEngine } from './infrastructure/cli/YargsCliEngine';
import { FizzBuzzCommand } from './infrastructure/cli/commands/FizzBuzzCommand';
import { GenerateCharactersCommand } from './infrastructure/cli/commands/GenerateCharactersCommand';
import { ColoredConsoleFizzBuzzPresenter } from './infrastructure/fizzbuzz/ColoredConsoleFizzBuzzPresenter';
import { ConsoleLogger } from './infrastructure/logger/ConsoleLogger';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { FileCopyPublisher } from './infrastructure/storage/FileCopyPublisher';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { GroqStoryGenerator } from './infrastructure/story-generator/GroqStoryGenerator';

const logger = new ConsoleLogger();
const scraper = new WikiScraper();
const storyGenerator = new GroqStoryGenerator();
const repository = new JsonRepository();
const publisher = new FileCopyPublisher(
  `${config.storage.outputDir}/${config.storage.outputFile}`,
  config.storage.frontendPublicPath
);
const generateCharactersUseCase = new GenerateCharacterCatalogUseCase(scraper, storyGenerator, repository, logger);

const fizzBuzzPresenter = new ColoredConsoleFizzBuzzPresenter();
const fizzBuzzUseCase = new RunFizzBuzzUseCase(fizzBuzzPresenter);

const commands = [new FizzBuzzCommand(fizzBuzzUseCase), new GenerateCharactersCommand(generateCharactersUseCase, publisher)];
const engine = new YargsCliEngine(hideBin(process.argv));
const processor = new CommandLineProcessor(commands, engine);
processor.run();
