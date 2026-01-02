
import fs from 'fs/promises';
import path from 'path';
import { config } from '../../config/config';

export class JsonRepository {
    private outputPath: string;
    private outputDir: string;

    constructor(outputDir?: string, outputFile?: string) {
        this.outputDir = outputDir || config.storage.outputDir;
        const file = outputFile || config.storage.outputFile;
        this.outputPath = path.join(this.outputDir, file);
    }

    async saveAll(data: any[]): Promise<void> {
        try {
            // Ensure directory exists before writing
            await fs.mkdir(this.outputDir, { recursive: true });

            await fs.writeFile(
                this.outputPath,
                JSON.stringify(data, null, 2),
                "utf-8"
            );
            console.log(`💾 Saved ${data.length} records to ${this.outputPath}`);
        } catch (error) {
            console.error(`❌ Error saving data to ${this.outputPath}:`, error);
            throw error;
        }
    }
}
