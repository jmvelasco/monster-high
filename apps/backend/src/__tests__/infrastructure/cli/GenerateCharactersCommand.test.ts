import { GenerateCharactersCommand } from '../../../infrastructure/cli/commands/GenerateCharactersCommand';
import { GenerateCharacterCatalogUseCase } from '../../../application/GenerateCharacterCatalogUseCase';
import { FileCopyPublisher } from '../../../infrastructure/storage/FileCopyPublisher';

class StubUseCase extends GenerateCharacterCatalogUseCase {
  lastCharacterName?: string;
  constructor() {
    super(null as any, null as any, null as any, null as any);
  }
  async execute(name?: string): Promise<void> {
    this.lastCharacterName = name;
  }
}

class FailingStubUseCase extends GenerateCharacterCatalogUseCase {
  constructor() {
    super(null as any, null as any, null as any, null as any);
  }
  async execute(): Promise<void> {
    throw new Error('use case failed');
  }
}

class StubPublisher extends FileCopyPublisher {
  publishCallCount = 0;
  constructor() {
    super('', '');
  }
  async publish(): Promise<void> {
    this.publishCallCount++;
  }
}

describe('The Generate Characters Command', () => {
  it('triggers the generation for a specific character when provided', async () => {
    const stubUseCase = new StubUseCase();
    const command = new GenerateCharactersCommand(stubUseCase, new StubPublisher());

    await command.execute({ character: 'Draculaura' });

    expect(stubUseCase.lastCharacterName).toBe('Draculaura');
  });

  it('triggers the generation for all characters when no name is provided', async () => {
    const stubUseCase = new StubUseCase();
    const command = new GenerateCharactersCommand(stubUseCase, new StubPublisher());

    await command.execute({});

    expect(stubUseCase.lastCharacterName).toBeUndefined();
  });

  it('calls publisher.publish() exactly once after a successful execution', async () => {
    const stubPublisher = new StubPublisher();
    const command = new GenerateCharactersCommand(new StubUseCase(), stubPublisher);

    await command.execute({});

    expect(stubPublisher.publishCallCount).toBe(1);
  });

  it('does not call publisher.publish() when the use case throws', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const stubPublisher = new StubPublisher();
    const command = new GenerateCharactersCommand(new FailingStubUseCase(), stubPublisher);

    await command.execute({});

    expect(stubPublisher.publishCallCount).toBe(0);
    mockExit.mockRestore();
  });
});
