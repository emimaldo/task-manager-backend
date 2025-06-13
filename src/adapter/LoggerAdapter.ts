// Adapter Pattern - Logger Adapter
// Adapts the ExternalLogger interface to match our ILogger interface
// This allows us to use third-party loggers without changing our application code

import { ILogger } from './ILogger';
import { ExternalLogger } from './ExternalLogger';

export class LoggerAdapter implements ILogger {
  private externalLogger = new ExternalLogger();

  log(message: string): void {
    try {
      // Adapting our simple log() method to the external logger's write() method
      this.externalLogger.write(message);
    } catch (error) {
      // Handle errors gracefully - could log to console as fallback
      console.error('Logging failed:', error);
    }
  }

  // Additional adapter methods for extended functionality
  logWithLevel(level: 'info' | 'warn' | 'error', message: string): void {
    this.externalLogger.writeWithLevel(level, message);
  }

  logToFile(filename: string, message: string): void {
    this.externalLogger.writeToFile(filename, message);
  }
}
  