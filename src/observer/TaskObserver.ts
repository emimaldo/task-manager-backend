// Observer Pattern - Main Observer (Subject) Implementation
// Manages subscribers and notifies them of task events

import { ISubscriber } from './ISubscriber';
import { ConsoleSubscriber } from './ConsoleSubscriber';

export class TaskObserver {
  private subscribers: ISubscriber[] = [new ConsoleSubscriber()];

  // Add a new subscriber to the notification list
  subscribe(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
  }

  // Remove a subscriber from the notification list
  unsubscribe(subscriber: ISubscriber): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  // Notify all subscribers about a task event
  notify(task: any): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(task);
    }
  }

  // Get current number of subscribers
  getSubscriberCount(): number {
    return this.subscribers.length;
  }
}
  