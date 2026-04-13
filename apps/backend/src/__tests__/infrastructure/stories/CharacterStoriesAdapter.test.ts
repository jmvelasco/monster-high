import { CharacterStoriesAdapter } from '../../../infrastructure/stories/CharacterStoriesAdapter';
import { Character, CharacterLink } from '../../../domain/Character';
import { CharacterScraper } from '../../../domain/CharacterScraper';
import { CharacterAI } from '../../../domain/CharacterAI';

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
  private shouldFail = false;

  setShouldFail(fail: boolean) {
    this.shouldFail = fail;
  }

  async generateCharacterSummary(character: Character): Promise<string> {
    if (this.shouldFail) {
      throw new Error('AI service error');
    }
    return `Magical story for ${character.name}`;
  }
}

describe('The CharacterStoriesAdapter', () => {
  let scraper: FakeCharacterScraper;
  let aiService: FakeCharacterAI;
  let stories: CharacterStoriesAdapter;

  beforeEach(() => {
    scraper = new FakeCharacterScraper();
    aiService = new FakeCharacterAI();
    stories = new CharacterStoriesAdapter(scraper, aiService);
  });

  it('delegates scrapeCharacterLinks to the scraper', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };
    scraper.links = [link1, link2];

    const links = await stories.scrapeCharacterLinks();

    expect(links).toHaveLength(2);
    expect(links[0]?.name).toBe('Cleo de Nilo');
  });

  it('scrapes and enriches a character with story', async () => {
    const character = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    });

    scraper.details.set('/Cleo', character);

    const enriched = await stories.scrapeAndEnrich('/Cleo');

    expect(enriched).not.toBeNull();
    expect(enriched?.name).toBe('Cleo de Nilo');
    expect(enriched?.globalStory).toContain('Magical story for Cleo de Nilo');
  });

  it('returns null when scraper cannot find the character', async () => {
    const result = await stories.scrapeAndEnrich('/NonExistent');

    expect(result).toBeNull();
  });

  it('returns null when AI service fails', async () => {
    const character = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    });

    scraper.details.set('/Cleo', character);
    aiService.setShouldFail(true);

    const result = await stories.scrapeAndEnrich('/Cleo');

    expect(result).toBeNull();
  });
});
