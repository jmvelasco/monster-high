import Groq from 'groq-sdk';
import { setTimeout } from 'node:timers/promises';
import { config } from '../../config/config';
import { Character } from '../../domain/entities/Character';
import { CharacterStoryGenerator } from '../../domain/ports/CharacterStoryGenerator';

export class GroqStoryGenerator implements CharacterStoryGenerator {
  private readonly groq: Groq;

  constructor(groqClient?: Groq) {
    this.groq = groqClient || new Groq({ apiKey: config.ai.apiKey });
  }

  async generateStory(character: Character): Promise<string> {
    const contextText = character.getFlatContent();
    if (!contextText.trim()) {
      return 'A magical secret yet to be discovered!';
    }

    const prompt = this.buildPrompt(character.name, contextText);
    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: config.ai.model,
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens,
      });

      const summary = chatCompletion.choices[0]?.message?.content?.trim() || 'A magical secret!';
      await setTimeout(config.scraping.rateLimitDelay);

      return summary;
    } catch (error: any) {
      return this.handleGroqError(error, character);
    }
  }

  private buildPrompt(name: string, context: string): string {
    return `
        Act as an expert children's storyteller.
        Your mission is to tell a 6-year-old girl named Cloe the story about the Character ${name} from Monster High based on the provided information under "CHARACTER DATA".
        You have to use a direct and simple language in Spanish from Spain, not Latin American Spanish.
        
        INSTRUCTIONS:
        1. Use all the information provided under "CHARACTER DATA" to create a single coherent story.
        2. Make it a fluid story.
        3. Focus on appearance, personality, family, and friends.
        4. Maximum 5 or 6 sentences in total.
        5. Add line breaks for better readability, but do not divide the response into sections.
        6. The story MUST end with a complete closing sentence.
        7. Prioritize finishing the story over including every detail from the character data.
        
        CHARACTER DATA:
        "${context.substring(0, 15000)}" 
        
        DIRECT RESPONSE FOR CLOE (IN SPANISH FROM SPAIN):`;
  }

  private async handleGroqError(error: any, character: Character): Promise<string> {
    if (error.status === 429) {
      await setTimeout(config.ai.rateLimitDelay);
      return this.generateStory(character);
    }
    if (error.status === 401) {
      console.error(`   ❌ AI service error: ${error.error.error.message}`);
      return "This character's story is hidden in the magical mist!";
    }

    return "This character's story is hidden in the magical mist!";
  }
}
