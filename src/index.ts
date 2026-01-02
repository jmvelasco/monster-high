
import { WikiScraper } from './services/scraper/WikiScraper';
import { AIService } from './services/ai/AIService';
import { JsonRepository } from './services/storage/JsonRepository';
import { ProcessedCharacter } from './domain/character';
import { sleep } from './utils/sleep';
import { config } from './config/config';

async function main() {
    console.log("🚀 Starting Monster High Scraper Pipeline...");

    const scraper = new WikiScraper();
    const aiService = new AIService();
    const repository = new JsonRepository();

    try {
        // 1. Get List
        const characters = await scraper.getCharacterList();
        console.log(`📋 Found ${characters.length} characters.`);

        const results: ProcessedCharacter[] = [];

        // 2. Process each character
        for (const [index, charLink] of characters.entries()) {
            console.log(`\n▶️ [${index + 1}/${characters.length}] Processing: ${charLink.nombre}`);

            // 2.1 Scrape Details
            const details = await scraper.getCharacterDetails(charLink.url);

            if (!details) {
                console.warn(`⚠️ Skipping ${charLink.nombre} (No details found).`);
                continue;
            }

            // 2.2 Generate AI Summary
            console.log(`   ✨ Generating magic story for Cloe...`);
            const summary = await aiService.generateCharacterSummary(details.nombre, details.secciones);

            // 2.3 Construct Final Object
            const processedChar: ProcessedCharacter = {
                ...details,
                resumen_global: summary
            };

            results.push(processedChar);

            // 2.4 Save (Incremental)
            await repository.saveAll(results);

            // 2.5 Rate Limiting
            await sleep(config.scraping.rateLimitDelay);
        }

        console.log("\n🎉 Pipeline completed successfully!");

    } catch (error) {
        console.error("🔥 Critical Error in Pipeline:", error);
        process.exit(1);
    }
}

// Execute
main();
