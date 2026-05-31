import { GenerateCharacterCatalogUseCase } from '../../../application/GenerateCharacterCatalogUseCase';
import { Command } from '../../../domain/ports/Command';
import { FileCopyPublisher } from '../../storage/FileCopyPublisher';

export class GenerateCharactersCommand implements Command {
  readonly name = 'generate-characters';
  readonly description = 'Generate the Monster High characters catalog from Wiki data';

  readonly parameters = {
    options: {
      character: {
        type: 'string' as const,
        description: 'Name of the character to process',
      },
    },
  };

  constructor(
    private readonly useCase: GenerateCharacterCatalogUseCase,
    private readonly publisher: FileCopyPublisher
  ) {}

  async execute(args: Record<string, unknown>): Promise<void> {
    const character = args.character as string | undefined;

    console.log('🚀 Starting Monster High Character Generation');
    try {
      await this.useCase.execute(character);
      await this.publisher.publish();
      console.log('\n🎉 Generation completed successfully!');
    } catch (error) {
      console.error(`Critical Error in Generation: ${error}`);
      process.exit(1);
    }
  }
}
