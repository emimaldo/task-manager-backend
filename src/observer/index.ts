// Observer Pattern Module - Barrel export to facilitate imports
export { ISubscriber } from './ISubscriber';
export { TaskObserver } from './TaskObserver';
export { ConsoleSubscriber } from './ConsoleSubscriber';
export { EmailSubscriber } from './EmailSubscriber';
export { DatabaseLoggerSubscriber } from './DatabaseLoggerSubscriber';

// Observer Pattern Demo - Shows how to use multiple subscribers
import { TaskObserver } from './TaskObserver';
import { EmailSubscriber } from './EmailSubscriber';
import { DatabaseLoggerSubscriber } from './DatabaseLoggerSubscriber';

export class ObserverPatternDemo {
  static runDemo(): void {
    console.log('\n=== Observer Pattern Demo ===');
    
    const observer = new TaskObserver();
    
    // Add additional subscribers
    const emailSubscriber = new EmailSubscriber('admin@taskmanager.com');
    const dbLogger = new DatabaseLoggerSubscriber();
    
    observer.subscribe(emailSubscriber);
    observer.subscribe(dbLogger);
    
    console.log(`Total subscribers: ${observer.getSubscriberCount()}`);
    
    // Simulate task creation
    const mockTask = {
      getTitle: () => 'Complete project documentation'
    };
    
    console.log('\nNotifying all subscribers...');
    observer.notify(mockTask);
    
    // Remove a subscriber
    observer.unsubscribe(emailSubscriber);
    console.log(`\nAfter unsubscribing email: ${observer.getSubscriberCount()} subscribers`);
    
    observer.notify(mockTask);
  }
}
