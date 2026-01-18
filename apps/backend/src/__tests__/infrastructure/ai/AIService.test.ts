// TODO List:
// 1. [x] generateCharacterSummary returns default text when sections are empty
// 2. [x] generateCharacterSummary builds context from sections correctly
// 3. [x] generateCharacterSummary handles API errors gracefully
// 4. [x] generateCharacterSummary retries on rate limit (429)

import { Character } from '../../../domain/Character';
import { AIService } from '../../../infrastructure/ai/AIService';

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
      create: async () => {
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
                content: this.mockResponse || 'Hello Cloe! This is a magical character.',
              },
            },
          ],
        };
      },
    },
  };
}

describe('The AI Service', () => {
  test('returns default message when character has no section data', async () => {
    const fakeClient = new FakeGroqClient();
    const aiService = new AIService(fakeClient as any);
    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: {},
    });

    const summary = await aiService.generateCharacterSummary(character);

    expect(summary).toBe('A magical secret yet to be discovered!');
  });

  test('generates summary using character section data', async () => {
    const fakeClient = new FakeGroqClient();
    fakeClient.setMockResponse('Hello Cloe! Draculaura is a very sweet vampire.');
    const aiService = new AIService(fakeClient as any);

    const character = Character.fromDetails({
      name: 'Draculaura',
      url: 'http://test.com',
      technicalInfo: {},
      sections: {
        personality: {
          character: ['She is very friendly and sweet.'],
        },
      },
    });

    const summary = await aiService.generateCharacterSummary(character);

    expect(summary).toBe('Hello Cloe! Draculaura is a very sweet vampire.');
    expect(fakeClient.getCallCount()).toBe(1);
  });

  test('returns fallback message when API fails', async () => {
    const fakeClient = new FakeGroqClient();
    fakeClient.setError(500);
    const aiService = new AIService(fakeClient as any);

    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['Some data'] } },
    });

    const summary = await aiService.generateCharacterSummary(character);

    expect(summary).toBe("This character's story is hidden in the magical mist!");
  });

  test('retries when rate limit is hit', async () => {
    const fakeClient = new FakeGroqClient();
    let attemptCount = 0;

    fakeClient.chat.completions.create = async () => {
      attemptCount++;
      if (attemptCount === 1) {
        const error: any = new Error('Rate limit');
        error.status = 429;
        throw error;
      }
      return {
        choices: [
          {
            message: { content: 'Success after retry' },
          },
        ],
      };
    };

    const aiService = new AIService(fakeClient as any);
    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['data'] } },
    });

    const summary = await aiService.generateCharacterSummary(character);

    expect(summary).toBe('Success after retry');
    expect(attemptCount).toBe(2);
  }, 20000);
});
