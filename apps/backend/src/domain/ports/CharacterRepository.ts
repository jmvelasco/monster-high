import { Character } from '../entities/Character';

export interface CharacterRepository {
  saveAll(characters: Character[]): Promise<void>;
}
