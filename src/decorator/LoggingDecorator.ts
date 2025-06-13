// Decorator Pattern - Logging Decorator
// Adds detailed execution logging to tasks

import { TaskDecorator } from './AbstractTaskDecorator';

export class LoggingDecorator extends TaskDecorator {
  execute(): void {
    console.log(`[LOG] Starting execution of task: ${this.getTitle()}`);
    console.log(`[LOG] Priority: ${this.getPriority()}`);
    console.log(`[LOG] Description: ${this.getDescription()}`);
    
    const startTime = new Date();
    super.execute();
    const endTime = new Date();
    
    console.log(`[LOG] Task completed in ${endTime.getTime() - startTime.getTime()}ms`);
  }
}
