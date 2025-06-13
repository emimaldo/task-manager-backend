// Observer Pattern - Database Logger Subscriber Implementation
// Concrete subscriber that simulates logging task events to database

import { ISubscriber } from './ISubscriber';

export class DatabaseLoggerSubscriber implements ISubscriber {
  update(task: any): void {
    const timestamp = new Date().toISOString();
    console.log(`💾 Database log entry [${timestamp}]: Task "${task.getTitle()}" created`);
  }

  // Method to simulate database connection check
  isConnected(): boolean {
    // Simulate database connectivity
    return true;
  }
}
