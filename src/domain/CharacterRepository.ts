import { Character } from './Character';

export interface CharacterRepository {
    saveAll(characters: Character[]): Promise<void>;
}
