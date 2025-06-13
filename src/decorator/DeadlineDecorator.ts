// Decorator Pattern - Deadline Decorator
// Adds deadline functionality with time calculations and warnings

import { DecoratedTask } from './DecoratedTask';
import { TaskDecorator } from './AbstractTaskDecorator';

export class DeadlineDecorator extends TaskDecorator {
  constructor(task: DecoratedTask, private deadline: Date) {
    super(task);
  }

  getDeadline(): Date | null {
    return this.deadline;
  }

  getDescription(): string {
    const timeLeft = this.deadline.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    return `${super.getDescription()} - Due in ${daysLeft} days (${this.deadline.toDateString()})`;
  }

  execute(): void {
    const timeLeft = this.deadline.getTime() - new Date().getTime();
    if (timeLeft < 0) {
      console.log('⏰ WARNING: This task is overdue!');
    } else if (timeLeft < 24 * 60 * 60 * 1000) {
      console.log('⏰ WARNING: This task is due today!');
    }
    super.execute();
  }
}
