import { GenerateCharactersCommand } from '../../../infrastructure/cli/commands/GenerateCharactersCommand';
import { GenerateCharacterCatalogUseCase } from '../../../application/GenerateCharacterCatalogUseCase';

class StubUseCase extends GenerateCharacterCatalogUseCase {
  lastCharacterName?: string;
  constructor() {
    super(null as any, null as any, null as any, null as any);
  }
  async execute(name?: string): Promise<void> {
    this.lastCharacterName = name;
  }
}

describe('The Generate Characters Command', () => {
  it('triggers the generation for a specific character when provided', async () => {
    const stubUseCase = new StubUseCase();
    const command = new GenerateCharactersCommand(stubUseCase);

    await command.execute({ character: 'Draculaura' });

    expect(stubUseCase.lastCharacterName).toBe('Draculaura');
  });

  it('triggers the generation for all characters when no name is provided', async () => {
    const stubUseCase = new StubUseCase();
    const command = new GenerateCharactersCommand(stubUseCase);

    await command.execute({});

    expect(stubUseCase.lastCharacterName).toBeUndefined();
  });
});
