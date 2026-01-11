import Groq from "groq-sdk";
import { config } from "../../config/config";
import { Character } from "../../domain/Character";
import { CharacterAI } from "../../domain/CharacterAI";
import { setTimeout } from "node:timers/promises";

export class AIService implements CharacterAI {
    private readonly groq: Groq;

    constructor(groqClient?: Groq) {
        this.groq = groqClient || new Groq({ apiKey: config.ai.apiKey });
    }

    async generateCharacterSummary(character: Character): Promise<string> {
        const contextText = character.getFlatContent();

        if (!contextText.trim()) {
            return "A magical secret yet to be discovered!";
        }

        const prompt = this.buildPrompt(character.name, contextText);

        try {
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: config.ai.model,
                temperature: config.ai.temperature,
                max_tokens: config.ai.maxTokens,
            });

            return chatCompletion.choices[0]?.message?.content?.trim() || "A magical secret!";
        } catch (error: any) {
            return this.handleAiError(error, character);
        }
    }

    private buildPrompt(name: string, context: string): string {
        return `
        Act as an expert children's storyteller.
        Your mission is to tell a 6-year-old girl named Cloe who the Character ${name} from Monster High is.
        
        INSTRUCTIONS:
        1. Use all the information provided to create a single coherent story.
        2. Use very simple and sweet language. Greet Cloe affectionately in Spanish (she is a Spanish speaker).
        3. Do not divide the response into sections; make it a fluid story.
        4. Focus on appearance, personality, family, and friends.
        5. Maximum 5 or 6 sentences in total.
        6. Avoid technical or scary words.
        
        CHARACTER DATA:
        "${context.substring(0, 15000)}" 
        
        DIRECT RESPONSE FOR CLOE (IN SPANISH):`;
    }

    private async handleAiError(error: any, character: Character): Promise<string> {
        if (error.status === 429) {
            await setTimeout(config.ai.rateLimitDelay);
            return this.generateCharacterSummary(character);
        }
        return "This character's story is hidden in the magical mist!";
    }
}
