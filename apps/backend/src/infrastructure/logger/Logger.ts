import { Level } from '../../domain/Logger';

export class Logger implements Logger {
  constructor() {}
  log(level: Level, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }
}
