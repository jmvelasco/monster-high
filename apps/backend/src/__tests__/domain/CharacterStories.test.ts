import { CharacterStories } from '../../domain/CharacterStories';
import { Character, CharacterLink } from '../../domain/Character';

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

describe('The CharacterStories Port', () => {
  let stories: CharacterStories;

  beforeEach(() => {
    const fakeStories = new FakeCharacterStories();
    stories = fakeStories;
  });

  it('scrapes character links from the source', async () => {
    const link1: CharacterLink = { name: 'Cleo de Nilo', url: '/Cleo' };
    const link2: CharacterLink = { name: 'Draculaura', url: '/Draculaura' };

    (stories as any).links = [link1, link2];

    const links = await stories.scrapeCharacterLinks();

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

    (stories as any).enrichedCharacters.set('/Cleo', enrichedCharacter);

    const result = await stories.scrapeAndEnrich('/Cleo');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('Cleo de Nilo');
    expect(result?.globalStory).toBe('Epic story for Cleo');
  });

  it('returns null when character is not found', async () => {
    const result = await stories.scrapeAndEnrich('/NonExistent');

    expect(result).toBeNull();
  });
});
