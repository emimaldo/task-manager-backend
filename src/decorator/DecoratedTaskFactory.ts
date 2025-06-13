// Decorator Pattern - Factory for creating decorated tasks
// Simplifies the creation of tasks with multiple decorators

import { DecoratedTask } from './DecoratedTask';
import { BaseTask } from './BaseTask';
import { PriorityDecorator } from './PriorityDecorator';
import { DeadlineDecorator } from './DeadlineDecorator';
import { NotificationDecorator } from './NotificationDecorator';
import { LoggingDecorator } from './LoggingDecorator';

export class DecoratedTaskFactory {
  static createTask(title: string, decorators: {
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    deadline?: Date;
    notifications?: boolean;
    logging?: boolean;
  } = {}): DecoratedTask {
    let task: DecoratedTask = new BaseTask(title);

    // Apply decorators in specific order
    if (decorators.priority) {
      task = new PriorityDecorator(task, decorators.priority);
    }

    if (decorators.deadline) {
      task = new DeadlineDecorator(task, decorators.deadline);
    }

    if (decorators.notifications) {
      task = new NotificationDecorator(task);
    }

    if (decorators.logging) {
      task = new LoggingDecorator(task);
    }

    return task;
  }
}
