// Command Pattern - Update Task Command
// Encapsulates the update of a task with undo functionality

import { ICommand } from './ICommand';
import { ITaskRepository } from '../interfaces/ITaskRepository';

export class UpdateTaskCommand implements ICommand {
  private previousState?: any;

  constructor(
    private taskId: string,
    private updates: any,
    private repository: ITaskRepository
  ) {}

  execute() {
    this.previousState = this.repository.findById(this.taskId);
    const result = this.repository.update(this.taskId, this.updates);
    
    if (result) {
      console.log(`Task ${this.taskId} updated successfully`);
    }
    
    return result;
  }

  undo(): void {
    if (this.previousState) {
      this.repository.update(this.taskId, this.previousState);
      console.log(`Undoing task update: ${this.taskId}`);
    }
  }
}
