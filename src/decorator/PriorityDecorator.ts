// Decorator Pattern - Priority Decorator
// Adds priority functionality to tasks with visual indicators

import { DecoratedTask } from './DecoratedTask';
import { TaskDecorator } from './AbstractTaskDecorator';

export class PriorityDecorator extends TaskDecorator {
  constructor(task: DecoratedTask, private priority: 'low' | 'normal' | 'high' | 'urgent') {
    super(task);
  }

  getPriority(): string {
    return this.priority;
  }

  getTitle(): string {
    const priorityPrefix = this.priority === 'urgent' ? '🚨' : 
                          this.priority === 'high' ? '⚡' : 
                          this.priority === 'low' ? '📌' : '';
    return `${priorityPrefix} ${super.getTitle()}`;
  }

  execute(): void {
    if (this.priority === 'urgent') {
      console.log('⚠️ URGENT TASK EXECUTION!');
    }
    super.execute();
  }
}
