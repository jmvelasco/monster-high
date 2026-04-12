import { config } from '../../../config/config';
import { WikiScraper } from '../../../infrastructure/scraper/WikiScraper';

class FakeHttpClient {
  private responses: Map<string, string> = new Map();

  mockResponse(url: string, html: string) {
    this.responses.set(url, html);
  }

  async get(url: string): Promise<{ data: any }> {
    const html = this.responses.get(url);
    if (!html) throw new Error(`No mock response for ${url}`);

    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'Unknown';

    return {
      data: {
        parse: {
          title,
          text: {
            '*': html,
          },
        },
      },
    };
  }
}

describe('The Wiki Scraper', () => {
  test('returns empty list when HTML contains no characters', async () => {
    const fakeClient = new FakeHttpClient();
    const emptyHtml = '<html><body></body></html>';
    fakeClient.mockResponse(config.urls.charactersCategory, emptyHtml);

    const scraper = new WikiScraper(fakeClient as any);
    const characters = await scraper.getCharacterList();

    expect(characters).toEqual([]);
  });

  test('extracts name and URL from single character link', async () => {
    const fakeClient = new FakeHttpClient();
    const htmlWithOneCharacter = `
            <html>
                <body>
                    <div class="lightbox-caption">
                        <a href="/es/wiki/Draculaura">Draculaura</a>
                    </div>
                </body>
            </html>
        `;
    fakeClient.mockResponse(config.urls.charactersCategory, htmlWithOneCharacter);

    const scraper = new WikiScraper(fakeClient as any);
    const characters = await scraper.getCharacterList();

    expect(characters).toEqual([
      { name: 'Draculaura', url: config.urls.charactersDetails.replace('${characterName}', 'Draculaura') },
    ]);
  });

  test('extracts all characters from list with multiple entries', async () => {
    const fakeClient = new FakeHttpClient();
    const htmlWithMultiple = `
            <html>
                <body>
                    <div class="lightbox-caption"><a href="/es/wiki/Draculaura">Draculaura</a></div>
                    <div class="lightbox-caption"><a href="/es/wiki/Frankie_Stein">Frankie Stein</a></div>
                    <div class="lightbox-caption"><a href="/es/wiki/Clawdeen_Wolf">Clawdeen Wolf</a></div>
                </body>
            </html>
        `;
    fakeClient.mockResponse(config.urls.charactersCategory, htmlWithMultiple);

    const scraper = new WikiScraper(fakeClient as any);
    const characters = await scraper.getCharacterList();

    expect(characters).toHaveLength(3);
    expect(characters[0]).toEqual({
      name: 'Draculaura',
      url: config.urls.charactersDetails.replace('${characterName}', 'Draculaura'),
    });
    expect(characters[2]?.name).toBe('Clawdeen Wolf');
  });

  test('returns null when character page request fails', async () => {
    const fakeClient = new FakeHttpClient();
    const scraper = new WikiScraper(fakeClient as any);
    const details = await scraper.getCharacterDetails('https://invalid.url');

    expect(details).toBeNull();
  });

  test('extracts character name from page title', async () => {
    const fakeClient = new FakeHttpClient();
    const htmlWithName = `
            <html>
                <body>
                    <h1 class="mw-page-title-main">Draculaura</h1>
                </body>
            </html>
        `;
    fakeClient.mockResponse('https://test.url', htmlWithName);

    const scraper = new WikiScraper(fakeClient as any);
    const character = await scraper.getCharacterDetails('https://test.url');

    expect(character?.name).toBe('Draculaura');
  });

  test('extracts technical information from infobox', async () => {
    const fakeClient = new FakeHttpClient();
    const htmlWithInfobox = `
            <html>
                <body>
                    <h1 class="mw-page-title-main">Draculaura</h1>
                    <div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="edad">
                        <h3 class="pi-data-label pi-secondary-font"><b>Edad</b></h3>
                        <div class="pi-data-value pi-font">1599/1600 (Cumpleaños = 14 de Febrero)</div>
                    </div>
                    <div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="mascota">
                        <h3 class="pi-data-label pi-secondary-font"><b>Mascota</b></h3>
                        <div class="pi-data-value pi-font"><a href="/es/wiki/Count_Fabulous" title="Count Fabulous">Count Fabulous</a></div>
                    </div>
                    <div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="amigos">
                        <h3 class="pi-data-label pi-secondary-font"><b>Amigos</b></h3>
                        <div class="pi-data-value pi-font"><a href="/es/wiki/Frankie_Stein" title="Frankie Stein">Frankie Stein</a> y <a href="/es/wiki/Clawdeen_Wolf" title="Clawdeen Wolf">Clawdeen Wolf</a></div>
                    </div>
                    <div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="añomuñeca">
                        <h3 class="pi-data-label pi-secondary-font">añomuñeca</h3>
                        <div class="pi-data-value pi-font">2010</div>
                    </div>
                </body>
            </html>
        `;
    fakeClient.mockResponse('https://test.url', htmlWithInfobox);

    const scraper = new WikiScraper(fakeClient as any);
    const character = await scraper.getCharacterDetails('https://test.url');

    expect(character?.technicalInfo).toStrictEqual({
      edad: '1599/1600 (Cumpleaños = 14 de Febrero)',
      mascota: 'Count Fabulous',
      amigos: 'Frankie Stein, Clawdeen Wolf',
      anomuneca: '2010',
    });
  });

  test('extracts sections with H2 and H3 structure', async () => {
    const fakeClient = new FakeHttpClient();
    const htmlWithSections = `
            <html>
                <body>
                    <h1 class="mw-page-title-main">Draculaura</h1>
                    <h2><span class="mw-headline" id="Personalidad">Personalidad</span></h2>
                    <h3>Carácter</h3>
                    <p>Es muy dulce y amigable.</p>
                    <h3>Estilo y físico</h3>
                    <p>Draculaura tiene cabello color negro con mechas rosas.</p>
                </body>
            </html>
        `;
    fakeClient.mockResponse('https://test.url', htmlWithSections);

    const scraper = new WikiScraper(fakeClient as any);
    const character = await scraper.getCharacterDetails('https://test.url');

    expect(character?.sections.personalidad).toBeDefined();
    expect(character?.sections.personalidad?.caracter).toEqual(['Es muy dulce y amigable.']);
    expect(character?.sections.personalidad?.estiloYFisico).toEqual([
      'Draculaura tiene cabello color negro con mechas rosas.',
    ]);
  });
});
