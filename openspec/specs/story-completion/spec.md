### Requirement: Story token budget accommodates Spanish narratives
The AI configuration SHALL set `maxTokens` to 1024 to provide sufficient output space for 5-6 sentence stories in Spanish.

#### Scenario: Token budget allows full story generation
- **WHEN** the story generator requests a completion from the Groq API
- **THEN** `max_tokens` SHALL be set to 1024

### Requirement: Prompt instructs narrative closure
The system prompt SHALL explicitly instruct the model to always complete the story with a proper ending sentence, prioritizing narrative closure over including all character details.

#### Scenario: Prompt contains closure instruction
- **WHEN** `buildPrompt` constructs the prompt for the AI model
- **THEN** the prompt SHALL include an instruction that the story MUST end with a complete closing sentence

#### Scenario: Prompt prioritizes completion over detail
- **WHEN** `buildPrompt` constructs the prompt for the AI model
- **THEN** the prompt SHALL include an instruction to prioritize finishing the story over including every detail from the character data

### Requirement: Generated stories have complete endings
A generated story SHALL always end with a complete sentence terminated by proper punctuation (period, exclamation mark, or question mark).

#### Scenario: Story ends with complete sentence
- **WHEN** the AI generates a story for a character with sufficient data
- **THEN** the returned story SHALL end with a sentence that is grammatically complete and terminated by `.`, `!`, or `?`

#### Scenario: Story with minimal character data
- **WHEN** the character has very little data (short context)
- **THEN** the returned story SHALL still end with a complete sentence and proper punctuation
