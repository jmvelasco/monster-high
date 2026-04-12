export enum Level {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface Logger {
  log(level: Level, message: string): void;
}
