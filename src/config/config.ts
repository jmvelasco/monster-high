import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  urls: {
    base: 'https://monsterhigh.fandom.com',
    charactersCategory: 'https://monsterhigh.fandom.com/es/wiki/Categoría:Personajes',
  },
  scraping: {
    rateLimitDelay: 500, // ms
  },
  ai: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'llama-3.1-8b-instant',
    temperature: 0.6,
    maxTokens: 400,
    rateLimitDelay: 15000,
  },
  storage: {
    outputDir: path.resolve(__dirname, '../../data'), // Saving to a data folder outside src
    outputFile: 'monsterHighCharacters.json',
  },
};

// Validate required variables
if (!config.ai.apiKey) {
  console.warn('⚠️  WARNING: GROQ_API_KEY is not set in .env file. AI features will fail.');
}
