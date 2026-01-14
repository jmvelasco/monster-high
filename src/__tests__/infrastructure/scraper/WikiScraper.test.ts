
// TODO List:
// 1. [x] getCharacterList with empty HTML returns empty array
// 2. [x] getCharacterList with one character extracts name and URL
// 3. [x] getCharacterList with multiple characters extracts all
// 4. [x] getCharacterDetails returns null when request fails
// 5. [x] getCharacterDetails extracts basic name
// 6. [x] getCharacterDetails extracts technicalInfo (infobox)
// 7. [x] getCharacterDetails extracts sections H2/H3


import { config } from '../../../config/config';
import { WikiScraper } from '../../../infrastructure/scraper/WikiScraper';

class FakeHttpClient {
    private responses: Map<string, string> = new Map();

    mockResponse(url: string, html: string) {
        this.responses.set(url, html);
    }

    async get(url: string): Promise<{ data: string }> {
        const data = this.responses.get(url);
        if (!data) throw new Error(`No mock response for ${url}`);
        return { data };
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
                    <a class="category-page__member-link" href="/es/wiki/Draculaura">Draculaura</a>
                </body>
            </html>
        `;
        fakeClient.mockResponse(config.urls.charactersCategory, htmlWithOneCharacter);

        const scraper = new WikiScraper(fakeClient as any);
        const characters = await scraper.getCharacterList();

        expect(characters).toEqual([
            { name: 'Draculaura', url: 'https://monsterhigh.fandom.com/es/wiki/Draculaura' }
        ]);
    });

    test('extracts all characters from list with multiple entries', async () => {
        const fakeClient = new FakeHttpClient();
        const htmlWithMultiple = `
            <html>
                <body>
                    <a class="category-page__member-link" href="/es/wiki/Draculaura">Draculaura</a>
                    <a class="category-page__member-link" href="/es/wiki/Frankie_Stein">Frankie Stein</a>
                    <a class="category-page__member-link" href="/es/wiki/Clawdeen_Wolf">Clawdeen Wolf</a>
                </body>
            </html>
        `;
        fakeClient.mockResponse(config.urls.charactersCategory, htmlWithMultiple);

        const scraper = new WikiScraper(fakeClient as any);
        const characters = await scraper.getCharacterList();

        expect(characters).toHaveLength(3);
        expect(characters[0]).toEqual({ name: 'Draculaura', url: 'https://monsterhigh.fandom.com/es/wiki/Draculaura' });
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
                    <div class="pi-item pi-data">
                        <h3 class="pi-data-label">Edad:</h3>
                        <div class="pi-data-value">1600</div>
                    </div>
                    <div class="pi-item pi-data">
                        <h3 class="pi-data-label">Padres:</h3>
                        <div class="pi-data-value">Conde Drácula</div>
                    </div>
                </body>
            </html>
        `;
        fakeClient.mockResponse('https://test.url', htmlWithInfobox);

        const scraper = new WikiScraper(fakeClient as any);
        const character = await scraper.getCharacterDetails('https://test.url');

        expect(character?.technicalInfo.edad).toBe('1600');
        expect(character?.technicalInfo.padres).toBe('Conde Drácula');
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
        expect(character?.sections.personalidad?.estiloYFisico).toEqual(['Draculaura tiene cabello color negro con mechas rosas.']);

    });

});
