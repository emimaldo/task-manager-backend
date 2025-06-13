// Decorator Pattern - Base task implementation
// Concrete implementation of the base task with default behavior

import { DecoratedTask } from './DecoratedTask';

export class BaseTask implements DecoratedTask {
  constructor(private title: string) {}

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return 'Basic task';
  }

  getPriority(): string {
    return 'normal';
  }

  getDeadline(): Date | null {
    return null;
  }

  execute(): void {
    console.log(`Executing task: ${this.title}`);
  }
}
