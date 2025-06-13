// Decorator Pattern - Usage demonstration
// Shows how to use the decorator pattern with multiple decorators

import { BaseTask } from './BaseTask';
import { DecoratedTaskFactory } from './DecoratedTaskFactory';

export class TaskDecoratorDemo {
  static runDemo(): void {
    console.log('\n=== Decorator Pattern Demo ===');
    
    // Simple task
    const simpleTask = new BaseTask('Complete project documentation');
    simpleTask.execute();
    
    console.log('\n--- Adding decorators ---');
    
    // Task with multiple decorators
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2); // 2 days from today
    
    const complexTask = DecoratedTaskFactory.createTask('Complete project documentation', {
      priority: 'urgent',
      deadline: deadline,
      notifications: true,
      logging: true
    });
    
    console.log('Task title:', complexTask.getTitle());
    console.log('Description:', complexTask.getDescription());
    console.log('Priority:', complexTask.getPriority());
    console.log('Deadline:', complexTask.getDeadline());
    
    console.log('\nExecuting complex task:');
    complexTask.execute();
  }
}
