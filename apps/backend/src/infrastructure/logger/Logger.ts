export class Logger implements Logger {
  constructor(private readonly silenced: boolean) {}

  info(message: string): void {
    if (this.silenced) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`);
  }

  warn(message: string): void {
    if (this.silenced) return;

    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`);
  }

  error(message: string): void {
    if (this.silenced) return;

    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
  }

  console(message: string): void {
    if (this.silenced) return;

    console.log(`${message}`);
  }
}
