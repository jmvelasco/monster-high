import { CharacterEnricher } from '../../domain/CharacterEnricher';
import { Character, CharacterLink } from '../../domain/Character';

class FakeCharacterEnricher implements CharacterEnricher {
  public links: CharacterLink[] = [];
  public enrichedCharacters: Map<string, Character> = new Map();

  async scrapeCharacterLinks(): Promise<CharacterLink[]> {
    return this.links;
  }

  async scrapeAndEnrich(url: string): Promise<Character | null> {
    return this.enrichedCharacters.get(url) || null;
  }
}

describe('The CharacterEnricher Port', () => {
  let enricher: CharacterEnricher;

  beforeEach(() => {
    const fakeEnricher = new FakeCharacterEnricher();
    enricher = fakeEnricher;
  });

  it('scrapes character links from the source', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };

    (enricher as any).links = [link1, link2];

    const links = await enricher.scrapeCharacterLinks();

    expect(links).toHaveLength(2);
    expect(links[0]?.name).toBe('Cleo de Nilo');
    expect(links[1]?.name).toBe('Draculaura');
  });

  it('scrapes and enriches a character with story', async () => {
    const character = Character.fromDetails({
      name: 'Cleo de Nilo',
      url: '/Cleo',
      technicalInfo: {},
      sections: {},
      image: 'cleo.png',
    });

    const enrichedCharacter = character.withGlobalStory('Epic story for Cleo');

    (enricher as any).enrichedCharacters.set('/Cleo', enrichedCharacter);

    const result = await enricher.scrapeAndEnrich('/Cleo');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('Cleo de Nilo');
    expect(result?.globalStory).toBe('Epic story for Cleo');
  });

  it('returns null when character is not found', async () => {
    const result = await enricher.scrapeAndEnrich('/NonExistent');

    expect(result).toBeNull();
  });
});
