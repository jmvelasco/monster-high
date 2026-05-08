import { Character } from '../../../domain/entities/Character';
import { GroqStoryGenerator } from '../../../infrastructure/story-generator/GroqStoryGenerator';

class FakeGroqClient {
  private mockResponse: string | null = null;
  private shouldError: boolean = false;
  private errorStatus?: number;
  private callCount: number = 0;
  private lastPrompt: string = '';

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

  getLastPrompt(): string {
    return this.lastPrompt;
  }

  chat = {
    completions: {
      create: async (params: any) => {
        this.callCount++;
        this.lastPrompt = params.messages?.[0]?.content || '';

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

describe('The GroqStoryGenerator', () => {
  test('returns default message when character has no section data', async () => {
    const fakeClient = new FakeGroqClient();
    const storyGenerator = new GroqStoryGenerator(fakeClient as any);
    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: {},
    });

    const story = await storyGenerator.generateStory(character);

    expect(story).toBe('A magical secret yet to be discovered!');
  });

  test('generates story using character section data', async () => {
    const fakeClient = new FakeGroqClient();
    fakeClient.setMockResponse('Hello Cloe! Draculaura is a very sweet vampire.');
    const storyGenerator = new GroqStoryGenerator(fakeClient as any);

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

    const story = await storyGenerator.generateStory(character);

    expect(story).toBe('Hello Cloe! Draculaura is a very sweet vampire.');
    expect(fakeClient.getCallCount()).toBe(1);
  });

  test('returns fallback message when API fails', async () => {
    const fakeClient = new FakeGroqClient();
    fakeClient.setError(500);
    const storyGenerator = new GroqStoryGenerator(fakeClient as any);

    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['Some data'] } },
    });

    const story = await storyGenerator.generateStory(character);

    expect(story).toBe("This character's story is hidden in the magical mist!");
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

    const storyGenerator = new GroqStoryGenerator(fakeClient as any);
    const character = Character.fromDetails({
      name: 'TestChar',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['data'] } },
    });

    const story = await storyGenerator.generateStory(character);

    expect(story).toBe('Success after retry');
    expect(attemptCount).toBe(2);
  }, 20000);

  test('instructs the model to end stories with a complete closing sentence', async () => {
    const fakeClient = new FakeGroqClient();
    const storyGenerator = new GroqStoryGenerator(fakeClient as any);
    const character = Character.fromDetails({
      name: 'Draculaura',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['Some data'] } },
    });

    await storyGenerator.generateStory(character);

    expect(fakeClient.getLastPrompt().toLowerCase()).toContain('must end with a complete closing sentence');
  });

  test('instructs the model to prioritize finishing the story over including every detail', async () => {
    const fakeClient = new FakeGroqClient();
    const storyGenerator = new GroqStoryGenerator(fakeClient as any);
    const character = Character.fromDetails({
      name: 'Draculaura',
      url: 'http://test.com',
      technicalInfo: {},
      sections: { bio: { info: ['Some data'] } },
    });

    await storyGenerator.generateStory(character);

    expect(fakeClient.getLastPrompt().toLowerCase()).toContain(
      'prioritize finishing the story over including every detail'
    );
  });
});
