// Adapter Pattern - File Logger Adapter
// Simulates adapting a file-based logging system to our ILogger interface

import { ILogger } from './ILogger';

export class FileLoggerAdapter implements ILogger {
  constructor(private filename: string = 'app.log') {}

  log(message: string): void {
    try {
      // In a real implementation, this would write to an actual file
      console.log(`[FILE:${this.filename}] ${new Date().toISOString()}: ${message}`);
    } catch (error) {
      // Handle errors gracefully
      console.error('File logging failed:', error);
    }
  }

  // Method to change the log file
  setLogFile(filename: string): void {
    this.filename = filename;
  }
}
