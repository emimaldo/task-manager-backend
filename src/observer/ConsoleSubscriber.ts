// Observer Pattern - Console Subscriber Implementation
// Concrete subscriber that logs task notifications to console

import { ISubscriber } from './ISubscriber';

export class ConsoleSubscriber implements ISubscriber {
  update(task: any): void {
    console.log(`📢 Task notification: ${task.getTitle()}`);
  }
}
