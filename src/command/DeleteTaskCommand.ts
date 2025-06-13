// Command Pattern - Delete Task Command
// Encapsulates the deletion of a task with undo functionality

import { ICommand } from './ICommand';
import { ITaskRepository } from '../interfaces/ITaskRepository';

export class DeleteTaskCommand implements ICommand {
  private deletedTask?: any;

  constructor(
    private taskId: string,
    private repository: ITaskRepository
  ) {}

  execute() {
    this.deletedTask = this.repository.findById(this.taskId);
    const result = this.repository.delete(this.taskId);
    
    if (result) {
      console.log(`Task ${this.taskId} deleted successfully`);
    }
    
    return result;
  }

  undo(): void {
    if (this.deletedTask) {
      this.repository.save(this.deletedTask);
      console.log(`Undoing task deletion: ${this.taskId}`);
    }
  }
}
