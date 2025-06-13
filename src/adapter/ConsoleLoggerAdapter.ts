// Adapter Pattern - Console Logger Adapter
// Another adapter implementation that adapts console logging to our ILogger interface

import { ILogger } from './ILogger';

export class ConsoleLoggerAdapter implements ILogger {
  log(message: string): void {
    console.log(`[Console] ${new Date().toISOString()}: ${message}`);
  }
}
