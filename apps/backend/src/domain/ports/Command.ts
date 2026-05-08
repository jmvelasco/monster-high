export interface CommandParameter {
  type: 'string' | 'number' | 'boolean';
  description: string;
}

export interface Command {
  readonly name: string;
  readonly description: string;
  readonly parameters?: {
    options?: Record<string, CommandParameter>;
    positionals?: Record<string, CommandParameter>;
  };
  execute(args: Record<string, unknown>): Promise<void> | void;
}
