// Decorator Pattern - Notification Decorator
// Adds notification functionality to task execution

import { DecoratedTask } from './DecoratedTask';
import { TaskDecorator } from './AbstractTaskDecorator';

export class NotificationDecorator extends TaskDecorator {
  constructor(task: DecoratedTask, private notifyBefore: number = 24) { // hours
    super(task);
  }

  execute(): void {
    console.log(`📧 Sending notification for task: ${this.getTitle()}`);
    super.execute();
    console.log(`✅ Task completed and stakeholders notified`);
  }

  getDescription(): string {
    return `${super.getDescription()} - With notifications enabled`;
  }
}
