
import Groq from "groq-sdk";
import { config } from "../../config/config";
import { CharacterSections } from "../../domain/character";
import { sleep } from "../../utils/sleep";

export class AIService {
    private groq: Groq;

    constructor(groqClient?: Groq) {
        this.groq = groqClient || new Groq({ apiKey: config.ai.apiKey });
    }

    async generateCharacterSummary(characterName: string, sections: CharacterSections): Promise<string> {
        // Build context for the AI
        let contextText = "";

        for (const [sectionName, subsections] of Object.entries(sections)) {
            for (const [subTitle, content] of Object.entries(subsections)) {
                // Handle both direct string array or object logic from interface
                const paragraphs = Array.isArray(content) ? content : (content as any).original || [];
                if (paragraphs.length > 0) {
                    contextText += `\n--- INFO ${sectionName.toUpperCase()} (${subTitle.toUpperCase()}): ---\n`;
                    contextText += paragraphs.join(" ");
                }
            }
        }

        if (!contextText.trim()) return "¡Un secreto mágico por descubrir!";

        const prompt = `
        Actúa como una cuentacuentos infantil experta. 
        Tu misión es contarle a una niña de 6 años llamada Cloe quién es el personaje ${characterName} de Monster High.
        
        INSTRUCCIONES:
        1. Usa toda la información proporcionada para crear un único relato coherente.
        2. Usa un lenguaje muy sencillo y dulce. Saluda a Cloe de forma cariñosa.
        3. No dividas la respuesta por secciones, haz una historia fluida.
        4. Enfócate en su apariencia, su personalidad, su familia y sus amigos.
        5. Máximo 5 o 6 frases en total.
        6. Evita palabras técnicas o asustadizas.
        
        DATOS DEL PERSONAJE:
        "${contextText.substring(0, 15000)}" 
        
        RESPUESTA DIRECTA PARA CLOE:`;
        // Note: truncated context just in case, though Groq usually has large context.

        try {
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: config.ai.model,
                temperature: config.ai.temperature,
                max_tokens: config.ai.maxTokens,
            });

            return chatCompletion.choices[0]?.message?.content?.trim() || "¡Un secreto mágico!";

        } catch (error: any) {
            if (error.status === 429) {
                console.log("⏳ [GROQ] Rate limit reached, waiting...");
                await sleep(config.ai.rateLimitDelay);
                return this.generateCharacterSummary(characterName, sections); // Retry
            }
            console.error(`❌ Error generating summary for ${characterName}:`, error.message);
            return "¡La historia de este personaje está oculta en la niebla mágica!";
        }
    }
}
