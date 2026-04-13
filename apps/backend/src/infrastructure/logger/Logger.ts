export class Logger implements Logger {
  constructor() {}
  info(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`);
  }
  warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`);
  }
  error(message: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
  }
  console(message: string): void {
    console.log(`${message}`);
  }
}
