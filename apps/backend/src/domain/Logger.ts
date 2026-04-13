export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  console(message: string): void;
}
