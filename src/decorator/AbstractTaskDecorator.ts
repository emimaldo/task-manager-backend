// Decorator Pattern - Abstract base decorator
// Provides default implementation that delegates to wrapped task

import { DecoratedTask } from './DecoratedTask';

export abstract class TaskDecorator implements DecoratedTask {
  constructor(protected task: DecoratedTask) {}

  getTitle(): string {
    return this.task.getTitle();
  }

  getDescription(): string {
    return this.task.getDescription();
  }

  getPriority(): string {
    return this.task.getPriority();
  }

  getDeadline(): Date | null {
    return this.task.getDeadline();
  }

  execute(): void {
    this.task.execute();
  }
}
