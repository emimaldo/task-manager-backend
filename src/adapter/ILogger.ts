// Adapter Pattern - Logger Interface
// Defines the contract for logging operations that our application expects

export interface ILogger {
  log(message: string): void;
}
