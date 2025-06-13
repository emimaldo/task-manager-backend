// Unit tests for Adapter Pattern implementation
// Tests all adapter classes and their functionality

import { ILogger } from '../../src/adapter/ILogger';
import { ExternalLogger } from '../../src/adapter/ExternalLogger';
import { LoggerAdapter } from '../../src/adapter/LoggerAdapter';
import { ConsoleLoggerAdapter } from '../../src/adapter/ConsoleLoggerAdapter';
import { FileLoggerAdapter } from '../../src/adapter/FileLoggerAdapter';

// Mock console.log for testing
const mockConsoleLog = jest.fn();
const originalConsoleLog = console.log;

describe('Adapter Pattern', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = mockConsoleLog;
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  describe('ExternalLogger', () => {
    let externalLogger: ExternalLogger;

    beforeEach(() => {
      externalLogger = new ExternalLogger();
    });

    it('should create an instance', () => {
      expect(externalLogger).toBeInstanceOf(ExternalLogger);
    });

    it('should write log message', () => {
      const message = 'Test log message';
      externalLogger.write(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(`[External] ${message}`);
    });

    it('should write log with level', () => {
      const level = 'ERROR';
      const message = 'Error message';
      externalLogger.writeWithLevel(level, message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(`[External:${level.toUpperCase()}] ${message}`);
    });

    it('should write to file', () => {
      const filename = 'test.log';
      const message = 'File content';
      
      externalLogger.writeToFile(filename, message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(`[External:FILE:${filename}] ${message}`);
    });
  });

  describe('LoggerAdapter', () => {
    let loggerAdapter: LoggerAdapter;
    let mockExternalLogger: jest.Mocked<ExternalLogger>;

    beforeEach(() => {
      loggerAdapter = new LoggerAdapter();
      // Access the private externalLogger for testing
      mockExternalLogger = (loggerAdapter as any).externalLogger;
      mockExternalLogger.write = jest.fn();
      mockExternalLogger.writeWithLevel = jest.fn();
      mockExternalLogger.writeToFile = jest.fn();
    });

    it('should implement ILogger interface', () => {
      expect(loggerAdapter).toHaveProperty('log');
      expect(typeof loggerAdapter.log).toBe('function');
    });

    it('should adapt basic log method', () => {
      const message = 'Test message';
      loggerAdapter.log(message);
      
      expect(mockExternalLogger.write).toHaveBeenCalledWith(message);
    });

    it('should provide extended functionality - logWithLevel', () => {
      const level: 'info' | 'warn' | 'error' = 'info';
      const message = 'Info message';
      loggerAdapter.logWithLevel(level, message);
      
      expect(mockExternalLogger.writeWithLevel).toHaveBeenCalledWith(level, message);
    });

    it('should provide extended functionality - logToFile', () => {
      const filename = 'test.log';
      const message = 'File message';
      loggerAdapter.logToFile(filename, message);
      
      expect(mockExternalLogger.writeToFile).toHaveBeenCalledWith(filename, message);
    });
  });

  describe('ConsoleLoggerAdapter', () => {
    let consoleAdapter: ConsoleLoggerAdapter;

    beforeEach(() => {
      consoleAdapter = new ConsoleLoggerAdapter();
    });

    it('should implement ILogger interface', () => {
      expect(consoleAdapter).toHaveProperty('log');
      expect(typeof consoleAdapter.log).toBe('function');
    });

    it('should log to console with prefix', () => {
      const message = 'Console test message';
      consoleAdapter.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[Console]')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should handle empty messages', () => {
      consoleAdapter.log('');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[Console]')
      );
    });

    it('should handle special characters in messages', () => {
      const specialMessage = 'Message with special chars: !@#$%^&*()';
      consoleAdapter.log(specialMessage);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(specialMessage)
      );
    });
  });

  describe('FileLoggerAdapter', () => {
    let fileAdapter: FileLoggerAdapter;

    beforeEach(() => {
      fileAdapter = new FileLoggerAdapter();
      jest.clearAllMocks();
    });

    it('should implement ILogger interface', () => {
      expect(fileAdapter).toHaveProperty('log');
      expect(typeof fileAdapter.log).toBe('function');
    });

    it('should create instance with default log file', () => {
      expect(fileAdapter).toBeInstanceOf(FileLoggerAdapter);
    });

    it('should create instance with custom log file', () => {
      const customFile = 'custom.log';
      const customAdapter = new FileLoggerAdapter(customFile);
      expect(customAdapter).toBeInstanceOf(FileLoggerAdapter);
    });

    it('should log to default file', () => {
      const message = 'File test message';
      fileAdapter.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[FILE:app.log]')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should log to custom file', () => {
      const customFile = 'test.log';
      const customAdapter = new FileLoggerAdapter(customFile);
      const message = 'Custom file message';
      
      customAdapter.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`[FILE:${customFile}]`)
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should change log file', () => {
      const newFile = 'new.log';
      const message = 'New file message';
      
      fileAdapter.setLogFile(newFile);
      fileAdapter.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`[FILE:${newFile}]`)
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should include timestamp in log entries', () => {
      const message = 'Timestamp test';
      fileAdapter.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
      );
    });
  });

  describe('Adapter Pattern Integration', () => {
    it('should allow polymorphic usage of all adapters', () => {
      const adapters: ILogger[] = [
        new LoggerAdapter(),
        new ConsoleLoggerAdapter(),
        new FileLoggerAdapter('test.log')
      ];

      const message = 'Polymorphic test message';

      // All adapters should be usable through the same interface
      adapters.forEach(adapter => {
        expect(() => adapter.log(message)).not.toThrow();
        expect(typeof adapter.log).toBe('function');
      });
    });

    it('should demonstrate the adapter pattern benefits', () => {
      // Function that works with any ILogger implementation
      const performLogging = (logger: ILogger, operation: string) => {
        logger.log(`Starting operation: ${operation}`);
        logger.log(`Operation ${operation} completed`);
      };

      const loggerAdapter = new LoggerAdapter();
      const consoleAdapter = new ConsoleLoggerAdapter();
      const fileAdapter = new FileLoggerAdapter();

      // Should work with all adapters without modification
      expect(() => performLogging(loggerAdapter, 'Test 1')).not.toThrow();
      expect(() => performLogging(consoleAdapter, 'Test 2')).not.toThrow();
      expect(() => performLogging(fileAdapter, 'Test 3')).not.toThrow();
    });

    it('should maintain consistent interface across different implementations', () => {
      const adapters = [
        new LoggerAdapter(),
        new ConsoleLoggerAdapter(),
        new FileLoggerAdapter()
      ];

      adapters.forEach(adapter => {
        expect(adapter).toHaveProperty('log');
        expect(typeof adapter.log).toBe('function');
        
        // Each adapter should handle the same interface consistently
        expect(() => adapter.log('Interface consistency test')).not.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle logging errors gracefully in LoggerAdapter', () => {
      const adapter = new LoggerAdapter();
      const mockExternalLogger = (adapter as any).externalLogger;
      mockExternalLogger.write = jest.fn().mockImplementation(() => {
        throw new Error('External logging failed');
      });

      // Should not throw, but handle error internally
      expect(() => adapter.log('Error test')).not.toThrow();
    });

    it('should handle console errors in FileLoggerAdapter', () => {
      const originalConsoleLog = console.log;
      console.log = jest.fn().mockImplementation(() => {
        throw new Error('Console error');
      });

      const adapter = new FileLoggerAdapter();
      
      // Should not throw, but handle error gracefully
      expect(() => adapter.log('File error test')).not.toThrow();
      
      // Restore console.log
      console.log = originalConsoleLog;
    });

    it('should handle null/undefined messages', () => {
      const adapters = [
        new LoggerAdapter(),
        new ConsoleLoggerAdapter(),
        new FileLoggerAdapter()
      ];

      adapters.forEach(adapter => {
        expect(() => adapter.log(null as any)).not.toThrow();
        expect(() => adapter.log(undefined as any)).not.toThrow();
      });
    });
  });
});
