import { GenerateCharacterCatalogUseCase } from '../../application/GenerateCharacterCatalogUseCase';
import { Character, CharacterLink } from '../../domain/entities/Character';
import { CharacterRepository } from '../../domain/ports/CharacterRepository';
import { CharacterScraper } from '../../domain/ports/CharacterScraper';
import { CharacterStoryGenerator } from '../../domain/ports/CharacterStoryGenerator';
import { Logger } from '../../domain/ports/Logger';

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

class FakeCharacterStoryGenerator implements CharacterStoryGenerator {
  public failForUrls: Set<string> = new Set();

  async generateStory(character: Character): Promise<string> {
    if (this.failForUrls.has(character.url)) {
      throw new Error(`Story generation failed for ${character.name}`);
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

describe('The GenerateCharacterCatalog UseCase', () => {
  let scraper: FakeCharacterScraper;
  let storyGenerator: FakeCharacterStoryGenerator;
  let repository: FakeCharacterRepository;
  let useCase: GenerateCharacterCatalogUseCase;
  const logger = new FakeLogger();

  beforeEach(() => {
    scraper = new FakeCharacterScraper();
    storyGenerator = new FakeCharacterStoryGenerator();
    repository = new FakeCharacterRepository();
    useCase = new GenerateCharacterCatalogUseCase(scraper, storyGenerator, repository, logger);
  });

  it('publishes all characters when no specific character is provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    scraper.characters.set(
      '/Cleo',
      Character.fromDetails({
        name: 'Cleo de Nilo',
        url: '/Cleo',
        technicalInfo: { dummy: 'value' },
        sections: {},
        image: 'cleo.png',
      })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({
        name: 'Draculaura',
        url: '/Draculaura',
        technicalInfo: { dummy: 'value' },
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
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: { dummy: 'value' }, sections: {} })
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
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: { dummy: 'value' }, sections: {} })
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
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: { dummy: 'value' }, sections: {} })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({ name: 'Draculaura', url: '/Draculaura', technicalInfo: { dummy: 'value' }, sections: {} })
    );

    storyGenerator.failForUrls.add('/Draculaura');

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
      Character.fromDetails({ name: 'Cleo de Nilo', url: '/Cleo', technicalInfo: { dummy: 'value' }, sections: {} })
    );
    scraper.characters.set(
      '/Draculaura',
      Character.fromDetails({ name: 'Draculaura', url: '/Draculaura', technicalInfo: { dummy: 'value' }, sections: {} })
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
