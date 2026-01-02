
// TODO List:
// 1. [x] getCharacterList with empty HTML returns empty array
// 2. [x] getCharacterList with one character extracts name and URL
// 3. [x] getCharacterList with multiple characters extracts all
// 4. [ ] getCharacterDetails returns null when request fails
// 5. [ ] getCharacterDetails extracts basic name
// 6. [ ] getCharacterDetails extracts info_tecnica (infobox)
// 7. [ ] getCharacterDetails extracts sections H2/H3

import { WikiScraper } from './WikiScraper';
import { config } from '../../config/config';

// Fake HTTP Client for testing
class FakeHttpClient {
    private responses: Map<string, string> = new Map();

    mockResponse(url: string, html: string) {
        this.responses.set(url, html);
    }

    async get(url: string): Promise<{ data: string }> {
        const data = this.responses.get(url);
        if (!data) {
            throw new Error(`No mock response for ${url}`);
        }
        return { data };
    }
}

describe('The Wiki Scraper', () => {

    // Test 1: Simplest case
    test('returns empty list when HTML contains no characters', async () => {
        const fakeClient = new FakeHttpClient();
        const emptyHtml = '<html><body></body></html>';
        fakeClient.mockResponse(config.urls.charactersCategory, emptyHtml);

        const scraper = new WikiScraper(fakeClient as any);

        const characters = await scraper.getCharacterList();

        expect(characters).toEqual([]);
    });

    // Test 2: One character
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
            { nombre: 'Draculaura', url: 'https://monsterhigh.fandom.com/es/wiki/Draculaura' }
        ]);
    });

    // Test 3: Multiple characters
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
        expect(characters[0]).toEqual({ nombre: 'Draculaura', url: 'https://monsterhigh.fandom.com/es/wiki/Draculaura' });
        expect(characters[2]?.nombre).toBe('Clawdeen Wolf');
    });

    // Test 4: Error handling
    test('returns null when character page request fails', async () => {
        const fakeClient = new FakeHttpClient();
        // No mockResponse set, so it will throw

        const scraper = new WikiScraper(fakeClient as any);

        const details = await scraper.getCharacterDetails('https://invalid.url');

        expect(details).toBeNull();
    });

    // Test 5: Basic name extraction
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

        const details = await scraper.getCharacterDetails('https://test.url');

        expect(details?.nombre).toBe('Draculaura');
    });

    // Test 6: Infobox extraction
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

        const details = await scraper.getCharacterDetails('https://test.url');

        expect(details?.info_tecnica.edad).toBe('1600');
        expect(details?.info_tecnica.padres).toBe('Conde Drácula');
    });

    // Test 7: Sections extraction
    test('extracts sections with H2 and H3 structure', async () => {
        const fakeClient = new FakeHttpClient();
        const htmlWithSections = `
            <html>
                <body>
                    <h1 class="mw-page-title-main">Draculaura</h1>
                    <h2><span class="mw-headline" id="Personalidad">Personalidad</span></h2>
                    <h3>Carácter</h3>
                    <p>Es muy dulce y amigable.</p>
                    <h3>Gustos</h3>
                    <p>Le encanta el color rosa.</p>
                </body>
            </html>
        `;
        fakeClient.mockResponse('https://test.url', htmlWithSections);

        const scraper = new WikiScraper(fakeClient as any);

        const details = await scraper.getCharacterDetails('https://test.url');

        expect(details?.secciones.personalidad).toBeDefined();
        expect(details?.secciones.personalidad?.carácter).toEqual(['Es muy dulce y amigable.']);
        expect(details?.secciones.personalidad?.gustos).toEqual(['Le encanta el color rosa.']);
    });
});
