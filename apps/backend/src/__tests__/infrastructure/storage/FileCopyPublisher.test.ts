import fs from 'fs/promises';
import path from 'path';
import { FileCopyPublisher } from '../../../infrastructure/storage/FileCopyPublisher';

const testDir = path.join(__dirname, '../../test-output/file-copy-publisher');
const srcPath = path.join(testDir, 'source.json');
const destDir = path.join(testDir, 'dest');
const destPath = path.join(destDir, 'output.json');

describe('FileCopyPublisher', () => {
  beforeEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('copies the source file content to the destination path', async () => {
    const payload = JSON.stringify([{ name: 'Draculaura' }]);
    await fs.writeFile(srcPath, payload, 'utf-8');

    const publisher = new FileCopyPublisher(srcPath, destPath);
    await publisher.publish();

    const result = await fs.readFile(destPath, 'utf-8');
    expect(result).toBe(payload);
  });

  it('creates the destination directory when it does not exist', async () => {
    await fs.writeFile(srcPath, '[]', 'utf-8');

    const publisher = new FileCopyPublisher(srcPath, destPath);
    await publisher.publish();

    const dirExists = await fs
      .access(destDir)
      .then(() => true)
      .catch(() => false);
    expect(dirExists).toBe(true);
  });

  it('throws a descriptive error when the source file does not exist', async () => {
    const publisher = new FileCopyPublisher(srcPath, destPath);

    await expect(publisher.publish()).rejects.toThrow(/source/i);
  });
});
