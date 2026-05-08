import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { GenerateCharacterCatalogUseCase } from './application/GenerateCharacterCatalogUseCase';
import { RunFizzBuzzUseCase } from './application/RunFizzBuzzUseCase';
import { CLIEngine, CommandLineProcessor } from './infrastructure/cli/CommandLineProcessor';
import { FizzBuzzCommand } from './infrastructure/cli/commands/FizzBuzzCommand';
import { GenerateCharactersCommand } from './infrastructure/cli/commands/GenerateCharactersCommand';
import { ColoredConsoleFizzBuzzPresenter } from './infrastructure/fizzbuzz/ColoredConsoleFizzBuzzPresenter';
import { ConsoleLogger } from './infrastructure/logger/ConsoleLogger';
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { GroqStoryGenerator } from './infrastructure/story-generator/GroqStoryGenerator';

// Composition Root
const logger = new ConsoleLogger();

const fizzBuzzPresenter = new ColoredConsoleFizzBuzzPresenter();
const fizzBuzzUseCase = new RunFizzBuzzUseCase(fizzBuzzPresenter);

const scraper = new WikiScraper();
const storyGenerator = new GroqStoryGenerator();
const repository = new JsonRepository();
const generateCharactersUseCase = new GenerateCharacterCatalogUseCase(scraper, storyGenerator, repository, logger);

const commands = [new FizzBuzzCommand(fizzBuzzUseCase), new GenerateCharactersCommand(generateCharactersUseCase)];

const yargsInstance = yargs(hideBin(process.argv)) as unknown as CLIEngine;
const processor = new CommandLineProcessor(commands, yargsInstance);

processor.run();
