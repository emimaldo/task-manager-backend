// Adapter Pattern - External Logger
// Represents a third-party logging service with its own interface
// In real scenarios, this could be Winston, Log4j, Serilog, etc.

export class ExternalLogger {
  write(msg: string): void {
    console.log(`[External] ${msg}`);
  }

  // Simulating other methods that external loggers might have
  writeWithLevel(level: string, msg: string): void {
    console.log(`[External:${level.toUpperCase()}] ${msg}`);
  }

  writeToFile(filename: string, msg: string): void {
    console.log(`[External:FILE:${filename}] ${msg}`);
  }
}
