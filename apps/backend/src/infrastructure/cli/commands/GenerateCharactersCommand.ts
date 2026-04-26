import { GenerateCharacterCatalogUseCase } from '../../../application/GenerateCharacterCatalogUseCase';
import { Command } from '../Command';

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

  constructor(private readonly useCase: GenerateCharacterCatalogUseCase) {}

  async execute(args: Record<string, unknown>): Promise<void> {
    const character = args.character as string | undefined;

    // We can still keep the logger for infrastructure-level logging if needed,
    // but the useCase already has it.
    console.log('🚀 Starting Monster High Character Generation');
    try {
      await this.useCase.execute(character);
      console.log('\n🎉 Generation completed successfully!');
    } catch (error) {
      console.error(`Critical Error in Generation: ${error}`);
      process.exit(1);
    }
  }
}
