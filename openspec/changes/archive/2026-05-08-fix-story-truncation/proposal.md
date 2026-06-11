## Why

The AI-generated character stories are frequently truncated mid-sentence. The Groq API cuts the response when it reaches the `max_tokens` limit (currently 400), and the model (`llama-3.1-8b-instant`) does not anticipate the boundary to close the narrative. Spanish text consumes more tokens per word than English, making the limit too tight for 5-6 sentence stories. The result is a degraded reading experience for the end user.

## What Changes

- Increase `max_tokens` from 400 to 1024 in the AI configuration to give the model enough room to finish stories.
- Improve the system prompt in `GroqStoryGenerator` to explicitly instruct the model to always complete the story with a proper ending, prioritizing narrative closure over detail completeness.

## Capabilities

### New Capabilities

- `story-completion`: Ensures AI-generated character stories always have a complete narrative arc with a proper ending, combining token budget and prompt improvements.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- `apps/backend/src/config/config.ts` — `ai.maxTokens` value changes.
- `apps/backend/src/infrastructure/story-generator/GroqStoryGenerator.ts` — prompt template changes in `buildPrompt`.
- Token consumption per request increases (~2.5×), which may affect Groq API costs and rate limits.
- Previously generated stories in `data/monsterHighCharacters.json` are not retroactively fixed; a re-run of the generation pipeline is needed.

## Non-goals

- Changing the AI model (`llama-3.1-8b-instant`).
- Adding retry logic for truncated responses.
- Modifying how stories are displayed in the frontend.
- Regenerating the existing character data file as part of this change.
