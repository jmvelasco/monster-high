import fs from 'fs/promises';
import path from 'path';

export class FileCopyPublisher {
  constructor(
    private readonly sourcePath: string,
    private readonly destinationPath: string
  ) {}

  async publish(): Promise<void> {
    const sourceExists = await fs
      .access(this.sourcePath)
      .then(() => true)
      .catch(() => false);

    if (!sourceExists) {
      throw new Error(`FileCopyPublisher: source file not found at "${this.sourcePath}"`);
    }

    await fs.mkdir(path.dirname(this.destinationPath), { recursive: true });
    await fs.copyFile(this.sourcePath, this.destinationPath);
  }
}
