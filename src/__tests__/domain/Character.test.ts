
import { Character, CharacterSections } from '../../domain/Character';

describe('Character Model', () => {
    const mockSections: CharacterSections = {
        appearance: {
            general: ["She is tall."]
        },
        friends: {
            best_friends: ["Draculaura", "Clawdeen"]
        }
    };

    const mockDetails = {
        name: "Frankie Stein",
        url: "http://example.com/frankie",
        technicalInfo: { age: "15" },
        sections: mockSections
    };

    test('should create a character from details', () => {
        const character = Character.fromDetails(mockDetails);
        expect(character.name).toBe("Frankie Stein");
        expect(character.technicalInfo.age).toBe("15");
    });

    test('should flatten content correctly for AI context', () => {
        const character = Character.fromDetails(mockDetails);
        const flattened = character.getFlatContent();

        expect(flattened).toContain("--- INFO APPEARANCE (GENERAL): ---");
        expect(flattened).toContain("She is tall.");
        expect(flattened).toContain("--- INFO FRIENDS (BEST_FRIENDS): ---");
        expect(flattened).toContain("Draculaura Clawdeen");
    });

    test('should return a new instance with global story', () => {
        const character = Character.fromDetails(mockDetails);
        const story = "A long time ago...";
        const enriched = character.withGlobalStory(story);

        expect(enriched.globalStory).toBe(story);
        expect(character.globalStory).toBeUndefined(); // Immutable
    });
});
