// Command Pattern - Base Command Interface
// Defines the contract that all commands must implement

export interface ICommand {
  execute(): any;
  undo?(): void;
}
