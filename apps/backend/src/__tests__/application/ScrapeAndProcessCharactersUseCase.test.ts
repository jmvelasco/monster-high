import { ScrapeAndProcessCharactersUseCase } from '../../application/ScrapeAndProcessCharactersUseCase';
import { Character, CharacterLink } from '../../domain/Character';
import { CharacterScraper } from '../../domain/CharacterScraper';
import { CharacterAI } from '../../domain/CharacterAI';
import { CharacterRepository } from '../../domain/CharacterRepository';

class FakeCharacterScraper implements CharacterScraper {
  public links: CharacterLink[] = [];
  public details: Map<string, Character> = new Map();

  async getCharacterList(): Promise<CharacterLink[]> {
    return this.links;
  }
  async getCharacterDetails(url: string): Promise<Character | null> {
    return this.details.get(url) || null;
  }
}

class FakeCharacterAI implements CharacterAI {
  async generateCharacterSummary(character: Character): Promise<string> {
    return `Story for ${character.name}`;
  }
}

class FakeCharacterRepository implements CharacterRepository {
  public savedCharacters: Character[] = [];
  async saveAll(characters: Character[]): Promise<void> {
    this.savedCharacters = [...characters];
  }
}

describe('The ScrapeAndProcessCharacters UseCase', () => {
  let scraper: FakeCharacterScraper;
  let aiService: FakeCharacterAI;
  let repository: FakeCharacterRepository;
  let useCase: ScrapeAndProcessCharactersUseCase;

  beforeEach(() => {
    scraper = new FakeCharacterScraper();
    aiService = new FakeCharacterAI();
    repository = new FakeCharacterRepository();
    useCase = new ScrapeAndProcessCharactersUseCase(scraper, aiService, repository);
  });

  it('processes all characters when no specific character is provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    });
    const char2 = Character.fromDetails({
      name: 'Draculaura',
      url: '/Draculaura',
      technicalInfo: {},
      sections: {},
      image: 'draculaura.png',
    });

    scraper.details.set('/Cleo', char1);
    scraper.details.set('/Draculaura', char2);

    await useCase.execute();

    expect(repository.savedCharacters).toHaveLength(2);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
    expect(repository.savedCharacters[1]?.name).toBe('Draculaura');
  });

  it('processes only the specific character when provided', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    const char1 = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    });
    const char2 = Character.fromDetails({
      name: 'Draculaura',
      url: '/Draculaura',
      technicalInfo: {},
      sections: {},
      image: 'draculaura.png',
    });

    scraper.details.set('/Cleo', char1);
    scraper.details.set('/Draculaura', char2);

    await useCase.execute('Cleo de Nilo');

    expect(repository.savedCharacters).toHaveLength(1);
    expect(repository.savedCharacters[0]?.name).toBe('Cleo de Nilo');
  });
});
