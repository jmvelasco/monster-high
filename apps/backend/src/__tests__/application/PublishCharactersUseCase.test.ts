import { PublishCharactersUseCase } from '../../application/PublishCharactersUseCase';
import { Character, CharacterLink } from '../../domain/Character';
import { CharacterAI } from '../../domain/CharacterAI';
import { CharacterRepository } from '../../domain/CharacterRepository';
import { CharacterScraper } from '../../domain/CharacterScraper';
import { Logger } from '../../domain/Logger';

class FakeCharacterScraper implements CharacterScraper {
  public links: CharacterLink[] = [];
  public characters: Map<string, Character> = new Map();

  async getCharacterList(): Promise<CharacterLink[]> {
    return this.links;
  }

  async getCharacterDetails(url: string): Promise<Character | null> {
    return this.characters.get(url) ?? null;
  }
}

class FakeCharacterAI implements CharacterAI {
  public failForUrls: Set<string> = new Set();

  async generateCharacterSummary(character: Character): Promise<string> {
    if (this.failForUrls.has(character.url)) {
      throw new Error(`AI failed for ${character.name}`);
    }
    return `Story for ${character.name}`;
  }
}

class FakeCharacterRepository implements CharacterRepository {
  public savedCharacters: Character[] = [];

  async saveAll(characters: Character[]): Promise<void> {
    this.savedCharacters = [...characters];
  }
}

class FakeLogger implements Logger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(_message: string): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(_message: string): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(_message: string): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(_message: string): void {}
}

describe('The PublishCharacters UseCase', () => {
  let scraper: FakeCharacterScraper;
  let aiService: FakeCharacterAI;
  let repository: FakeCharacterRepository;
  let useCase: PublishCharactersUseCase;
  const logger = new FakeLogger();

  beforeEach(() => {
    scraper = new FakeCharacterScraper();
    aiService = new FakeCharacterAI();
    repository = new FakeCharacterRepository();
    useCase = new PublishCharactersUseCase(scraper, aiService, repository, logger);
  });

  it('publishes all characters when no specific character is provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: {}, sections: {}, image: 'cleo.png' })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({
        name: 'Draculaura',
        url: '/Draculaura',
        technicalInfo: {},
        sections: {},
        image: 'draculaura.png',
      })
    );

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(2);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
    expect(repository.savedCharacters[1]?.name).toBe('Draculaura');
  });

  it('publishes only the specific character when provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: {}, sections: {} })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({ name: 'Draculaura', url: '/Draculaura', technicalInfo: {}, sections: {} })
    );

    await useCase.execute('Cleo de Nilo');

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });

  it('skips character if scraper cannot find details', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: {}, sections: {} })
    );
    // Draculaura intentionally not added

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });

  it('skips character if AI story generation fails', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: {}, sections: {} })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({ name: 'Draculaura', url: '/Draculaura', technicalInfo: {}, sections: {} })
    );

    aiService.failForUrls.add('/Draculaura');

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });

  it('persists characters to repository after each enrichment', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: {}, sections: {} })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({ name: 'Draculaura', url: '/Draculaura', technicalInfo: {}, sections: {} })
    );

    let saveCallCount = 0;
    const originalSaveAll = repository.saveAll.bind(repository);
    repository.saveAll = async (characters: Character[]) => {
      saveCallCount++;
      await originalSaveAll(characters);
    };

    await useCase.execute();

    expect(saveCallCount).toBeGreaterThanOrEqual(2);
  });
});
