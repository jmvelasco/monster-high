
import { WikiScraper } from './infrastructure/scraper/WikiScraper';
import { AIService } from './infrastructure/ai/AIService';
import { JsonRepository } from './infrastructure/storage/JsonRepository';
import { ScrapeAndProcessCharactersUseCase } from './application/ScrapeAndProcessCharactersUseCase';

async function runPipeline() {
    console.log("🚀 Starting Monster High Scraper Pipeline (Clean Architecture)...");

    const scraper = new WikiScraper();
    const aiService = new AIService();
    const repository = new JsonRepository();

    const useCase = new ScrapeAndProcessCharactersUseCase(scraper, aiService, repository);

    try {
        await useCase.execute();
        console.log("\n🎉 Pipeline completed successfully!");
    } catch (error) {
        console.error("🔥 Critical Error in Pipeline:", error);
        process.exit(1);
    }
}

runPipeline();
