
import { WikiScraper } from './services/scraper/WikiScraper';
import { AIService } from './services/ai/AIService';
import { JsonRepository } from './services/storage/JsonRepository';
import { Character } from './domain/Character';
import { sleep } from './utils/sleep';
import { config } from './config/config';

async function runPipeline() {
    console.log("🚀 Starting Monster High Scraper Pipeline...");

    const scraper = new WikiScraper();
    const aiService = new AIService();
    const repository = new JsonRepository();

    try {
        const characterLinks = await scraper.getCharacterList();
        console.log(`📋 Found ${characterLinks.length} characters.`);

        await processAllCharacters(characterLinks, scraper, aiService, repository);

        console.log("\n🎉 Pipeline completed successfully!");
    } catch (error) {
        console.error("🔥 Critical Error in Pipeline:", error);
        process.exit(1);
    }
}

async function processAllCharacters(
    links: { name: string; url: string }[],
    scraper: WikiScraper,
    aiService: AIService,
    repository: JsonRepository
) {
    const processedCharacters: Character[] = [];

    for (const [index, link] of links.entries()) {
        console.log(`\n▶️ [${index + 1}/${links.length}] Processing: ${link.name}`);

        const character = await scraper.getCharacterDetails(link.url);

        if (!character) {
            console.warn(`⚠️ Skipping ${link.name} (No details found).`);
            continue;
        }

        const enriched = await enrichWithStory(character, aiService);
        processedCharacters.push(enriched);

        await repository.saveAll(processedCharacters);
        await sleep(config.scraping.rateLimitDelay);
    }
}

async function enrichWithStory(character: Character, aiService: AIService): Promise<Character> {
    console.log(`   ✨ Generating magic story for Cloe...`);
    const story = await aiService.generateCharacterSummary(character);
    return character.withGlobalStory(story);
}

runPipeline();
