export interface ILogger {
    log(message: string): void;
  }
  
  export class ExternalLogger {
    write(msg: string) {
      console.log(`[External] ${msg}`);
    }
  }
  
  export class LoggerAdapter implements ILogger {
    private externalLogger = new ExternalLogger();
  
    log(message: string): void {
      this.externalLogger.write(message);
    }
  }
  