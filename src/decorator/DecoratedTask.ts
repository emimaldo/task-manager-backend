// Decorator Pattern - Base interface for decorable tasks
// Defines the contract that all tasks and decorators must implement

export interface DecoratedTask {
  getTitle(): string;
  getDescription(): string;
  getPriority(): string;
  getDeadline(): Date | null;
  execute(): void;
}
