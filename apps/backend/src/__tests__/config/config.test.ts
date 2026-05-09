import { config } from '../../config/config';

describe('The AI configuration', () => {
  test('sets maxTokens to 1024 for Spanish narrative generation', () => {
    expect(config.ai.maxTokens).toBe(1024);
  });
});
