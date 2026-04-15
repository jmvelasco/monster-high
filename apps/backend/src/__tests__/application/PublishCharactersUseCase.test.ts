import { PublishCharactersUseCase } from '../../application/PublishCharactersUseCase';
import { Character, CharacterLink } from '../../domain/Character';
import { CharacterRepository } from '../../domain/CharacterRepository';
import { CharacterStories } from '../../domain/CharacterStories';
import { Logger } from '../../domain/Logger';

class FakeCharacterStories implements CharacterStories {
  public links: CharacterLink[] = [];
  public enrichedCharacters: Map<string, Character> = new Map();

  async scrapeCharacterLinks(): Promise<CharacterLink[]> {
    return this.links;
  }

  async scrapeAndEnrich(url: string): Promise<Character | null> {
    return this.enrichedCharacters.get(url) || null;
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
  info(_message: string): void {
    // No-op for testing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(_message: string): void {
    // No-op for testing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(_message: string): void {
    // No-op for testing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(_message: string): void {
    // No-op for testing
  }
}

describe('The PublishCharacters UseCase', () => {
  let stories: FakeCharacterStories;
  let repository: FakeCharacterRepository;
  let useCase: PublishCharactersUseCase;
  const logger = new FakeLogger();

  beforeEach(() => {
    stories = new FakeCharacterStories();
    repository = new FakeCharacterRepository();

    useCase = new PublishCharactersUseCase(stories, repository, logger);
  });

  it('publishes all characters when no specific character is provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    stories.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    }).withGlobalStory('Story for Cleo');

    const char2 = Character.fromDetails({
      name: 'Draculaura',
      url: '/Draculaura',
      technicalInfo: {},
      sections: {},
      image: 'draculaura.png',
    }).withGlobalStory('Story for Draculaura');

    stories.enrichedCharacters.set('/Cleo', char1);
    stories.enrichedCharacters.set('/Draculaura', char2);

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(2);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
    expect(repository.savedCharacters[1]?.name).toBe('Draculaura');
  });

  it('publishes only the specific character when provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    stories.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    }).withGlobalStory('Story for Cleo');

    const char2 = Character.fromDetails({
      name: 'Draculaura',
      url: '/Draculaura',
      technicalInfo: {},
      sections: {},
      image: 'draculaura.png',
    }).withGlobalStory('Story for Draculaura');

    stories.enrichedCharacters.set('/Cleo', char1);
    stories.enrichedCharacters.set('/Draculaura', char2);

    await useCase.execute('Cleo de Nilo');

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });

  it('skips character if stories cannot find it', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    stories.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    }).withGlobalStory('Story for Cleo');

    stories.enrichedCharacters.set('/Cleo', char1);
    // Draculaura intentionally not added to enrichedCharacters

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });

  it('persists characters to repository after each enrichment', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    stories.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    }).withGlobalStory('Story for Cleo');

    const char2 = Character.fromDetails({
      name: 'Draculaura',
      url: '/Draculaura',
      technicalInfo: {},
      sections: {},
      image: 'draculaura.png',
    }).withGlobalStory('Story for Draculaura');

    stories.enrichedCharacters.set('/Cleo', char1);
    stories.enrichedCharacters.set('/Draculaura', char2);

    let saveCallCount = 0;
    const originalSaveAll = repository.saveAll.bind(repository);
    repository.saveAll = async (characters: Character[]) => {
      saveCallCount++;
      await originalSaveAll(characters);
    };

    await useCase.execute();

    // Should be called at least twice (once per character)
    expect(saveCallCount).toBeGreaterThanOrEqual(2);
  });
});
