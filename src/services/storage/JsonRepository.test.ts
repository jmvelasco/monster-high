
// TODO List:
// 1. [x] saveAll creates directory if it doesn't exist
// 2. [x] saveAll writes JSON file correctly
// 3. [x] saveAll overwrites existing file

import { JsonRepository } from './JsonRepository';
import fs from 'fs/promises';
import path from 'path';

// Test directory
const testOutputDir = path.join(__dirname, '../../../test-output');
const testOutputFile = 'test-characters.json';

describe('The JSON Repository', () => {

    // Clean up before each test
    beforeEach(async () => {
        try {
            await fs.rm(testOutputDir, { recursive: true, force: true });
        } catch (error) {
            // Directory might not exist, that's ok
        }
    });

    // Test 1: Creates directory
    test('creates output directory when it does not exist', async () => {
        const repository = new JsonRepository(testOutputDir, testOutputFile);

        await repository.saveAll([{ test: 'data' }]);

        const dirExists = await fs.access(testOutputDir).then(() => true).catch(() => false);
        expect(dirExists).toBe(true);
    });


    test('writes character data to JSON file with proper formatting', async () => {
        const repository = new JsonRepository(testOutputDir, testOutputFile);
        const testData = [
            { name: 'Draculaura', age: 1600 },
            { name: 'Frankie', age: 15 }
        ];

        await repository.saveAll(testData);

        const filePath = path.join(testOutputDir, testOutputFile);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(fileContent);

        expect(parsedData).toEqual(testData);
        expect(fileContent).toContain('  '); // Check for pretty-printing (2 spaces)
    });

    // Test 3: Overwrites existing file
    test('overwrites existing file with new data', async () => {
        const repository = new JsonRepository(testOutputDir, testOutputFile);

        await repository.saveAll([{ old: 'data' }]);
        await repository.saveAll([{ new: 'data' }]);

        const filePath = path.join(testOutputDir, testOutputFile);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(fileContent);

        expect(parsedData).toEqual([{ new: 'data' }]);
        expect(parsedData).not.toContainEqual({ old: 'data' });
    });
});
