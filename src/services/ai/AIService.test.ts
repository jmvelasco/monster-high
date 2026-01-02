
// TODO List:
// 1. [x] generateCharacterSummary returns default text when sections are empty
// 2. [x] generateCharacterSummary builds context from sections correctly
// 3. [x] generateCharacterSummary handles API errors gracefully
// 4. [x] generateCharacterSummary retries on rate limit (429)

import { AIService } from './AIService';
import { CharacterSections } from '../../domain/character';

// Fake Groq Client for testing
class FakeGroqClient {
    private mockResponse: string | null = null;
    private shouldError: boolean = false;
    private errorStatus?: number;
    private callCount: number = 0;

    setMockResponse(response: string) {
        this.mockResponse = response;
    }

    setError(status: number) {
        this.shouldError = true;
        this.errorStatus = status;
    }

    getCallCount(): number {
        return this.callCount;
    }

    chat = {
        completions: {
            create: async (params: any) => {
                this.callCount++;

                if (this.shouldError) {
                    const error: any = new Error('API Error');
                    error.status = this.errorStatus;
                    throw error;
                }

                return {
                    choices: [
                        {
                            message: {
                                content: this.mockResponse || '¡Hola Cloe! Este es un personaje mágico.'
                            }
                        }
                    ]
                };
            }
        }
    };
}

describe('The AI Service', () => {

    // Test 1: Empty sections
    test('returns default message when character has no section data', async () => {
        const fakeClient = new FakeGroqClient();
        const aiService = new AIService(fakeClient as any);
        const emptySections: CharacterSections = {};

        const summary = await aiService.generateCharacterSummary('TestChar', emptySections);

        expect(summary).toBe('¡Un secreto mágico por descubrir!');
    });

    // Test 2: Builds context correctly
    test('generates summary using character section data', async () => {
        const fakeClient = new FakeGroqClient();
        fakeClient.setMockResponse('¡Hola Cloe! Draculaura es una vampiresa muy dulce.');
        const aiService = new AIService(fakeClient as any);

        const sections: CharacterSections = {
            personalidad: {
                caracter: ['Es muy amigable y dulce.']
            }
        };

        const summary = await aiService.generateCharacterSummary('Draculaura', sections);

        expect(summary).toBe('¡Hola Cloe! Draculaura es una vampiresa muy dulce.');
        expect(fakeClient.getCallCount()).toBe(1);
    });

    // Test 3: Error handling
    test('returns fallback message when API fails', async () => {
        const fakeClient = new FakeGroqClient();
        fakeClient.setError(500);
        const aiService = new AIService(fakeClient as any);

        const sections: CharacterSections = {
            bio: { info: ['Some data'] }
        };

        const summary = await aiService.generateCharacterSummary('TestChar', sections);

        expect(summary).toBe('¡La historia de este personaje está oculta en la niebla mágica!');
    });

    // Test 4: Rate limit retry (this test is slow due to retry delay)
    test('retries when rate limit is hit', async () => {
        const fakeClient = new FakeGroqClient();
        let attemptCount = 0;

        // Override to fail first time, succeed second time
        fakeClient.chat.completions.create = async () => {
            attemptCount++;
            if (attemptCount === 1) {
                const error: any = new Error('Rate limit');
                error.status = 429;
                throw error;
            }
            return {
                choices: [{
                    message: { content: 'Success after retry' }
                }]
            };
        };

        const aiService = new AIService(fakeClient as any);
        const sections: CharacterSections = {
            bio: { info: ['data'] }
        };

        const summary = await aiService.generateCharacterSummary('TestChar', sections);

        expect(summary).toBe('Success after retry');
        expect(attemptCount).toBe(2);
    }, 20000); // Increased timeout for retry delay
});
