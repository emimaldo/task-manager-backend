// Observer Pattern Tests - Design Pattern Implementation Validation
// Tests the Observer pattern functionality with multiple subscribers

import { TaskObserver } from '../../src/observer/TaskObserver';
import { ConsoleSubscriber } from '../../src/observer/ConsoleSubscriber';
import { EmailSubscriber } from '../../src/observer/EmailSubscriber';
import { DatabaseLoggerSubscriber } from '../../src/observer/DatabaseLoggerSubscriber';
import { ISubscriber } from '../../src/observer/ISubscriber';

// Mock console.log to capture output for testing
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('Observer Pattern', () => {
  let observer: TaskObserver;
  let mockTask: any;

  beforeEach(() => {
    observer = new TaskObserver();
    mockTask = {
      getTitle: () => 'Test Task for Observer Pattern'
    };
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('TaskObserver', () => {
    test('should start with one default subscriber (ConsoleSubscriber)', () => {
      expect(observer.getSubscriberCount()).toBe(1);
    });

    test('should add new subscribers', () => {
      const emailSubscriber = new EmailSubscriber('test@example.com');
      observer.subscribe(emailSubscriber);
      
      expect(observer.getSubscriberCount()).toBe(2);
    });

    test('should remove subscribers', () => {
      const emailSubscriber = new EmailSubscriber('test@example.com');
      observer.subscribe(emailSubscriber);
      observer.unsubscribe(emailSubscriber);
      
      expect(observer.getSubscriberCount()).toBe(1);
    });

    test('should notify all subscribers when event occurs', () => {
      const emailSubscriber = new EmailSubscriber('admin@taskmanager.com');
      const dbLogger = new DatabaseLoggerSubscriber();
      
      observer.subscribe(emailSubscriber);
      observer.subscribe(dbLogger);
      
      observer.notify(mockTask);
      
      // Verify all subscribers were called
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('📢 Task notification: Test Task for Observer Pattern')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('📧 Email sent to admin@taskmanager.com')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('💾 Database log entry')
      );
    });
  });

  describe('Subscriber Implementations', () => {
    test('ConsoleSubscriber should log task notifications', () => {
      const consoleSubscriber = new ConsoleSubscriber();
      consoleSubscriber.update(mockTask);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '📢 Task notification: Test Task for Observer Pattern'
      );
    });

    test('EmailSubscriber should simulate email sending', () => {
      const emailSubscriber = new EmailSubscriber('user@example.com');
      emailSubscriber.update(mockTask);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '📧 Email sent to user@example.com: New task "Test Task for Observer Pattern" has been created'
      );
      expect(emailSubscriber.getEmail()).toBe('user@example.com');
    });

    test('DatabaseLoggerSubscriber should simulate database logging', () => {
      const dbLogger = new DatabaseLoggerSubscriber();
      dbLogger.update(mockTask);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/💾 Database log entry \[.*\]: Task "Test Task for Observer Pattern" created/)
      );
      expect(dbLogger.isConnected()).toBe(true);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle multiple notifications efficiently', () => {
      const emailSubscriber = new EmailSubscriber('bulk@example.com');
      observer.subscribe(emailSubscriber);
      
      // Simulate multiple task notifications
      for (let i = 1; i <= 3; i++) {
        const task = { getTitle: () => `Task ${i}` };
        observer.notify(task);
      }
      
      expect(mockConsoleLog).toHaveBeenCalledTimes(6); // 3 tasks × 2 subscribers
    });

    test('should work with custom subscriber implementations', () => {
      class TestSubscriber implements ISubscriber {
        public notifications: string[] = [];
        
        update(task: any): void {
          this.notifications.push(task.getTitle());
        }
      }
      
      const testSubscriber = new TestSubscriber();
      observer.subscribe(testSubscriber);
      
      observer.notify(mockTask);
      
      expect(testSubscriber.notifications).toContain('Test Task for Observer Pattern');
    });

    test('should maintain subscription order', () => {
      const subscriber1 = new EmailSubscriber('first@example.com');
      const subscriber2 = new EmailSubscriber('second@example.com');
      
      observer.subscribe(subscriber1);
      observer.subscribe(subscriber2);
      
      observer.notify(mockTask);
      
      const logCalls = mockConsoleLog.mock.calls.map(call => call[0]);
      const firstEmailIndex = logCalls.findIndex(log => log.includes('first@example.com'));
      const secondEmailIndex = logCalls.findIndex(log => log.includes('second@example.com'));
      
      expect(firstEmailIndex).toBeLessThan(secondEmailIndex);
    });
  });
});
