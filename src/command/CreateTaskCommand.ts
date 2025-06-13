// Command Pattern - Create Task Command
// Encapsulates the creation of a task with undo functionality

import { ICommand } from './ICommand';
import { TaskFactory } from '../factory/TaskFactory';
import { TaskObserver } from '../observer';
import { ITaskRepository } from '../interfaces/ITaskRepository';

export class CreateTaskCommand implements ICommand {
  private createdTaskId?: string;

  constructor(
    private title: string,
    private type: string,
    private repository: ITaskRepository,
    private observer: TaskObserver
  ) {}

  execute() {
    // Use Factory Pattern to create the task
    const task = TaskFactory.createTask(this.type, this.title);
    
    // Save in repository
    const savedTask = this.repository.save({
      title: task.getTitle(),
      type: this.type
    });

    // Save ID for possible undo
    this.createdTaskId = savedTask.id;

    // Notify observers
    this.observer.notify(task);

    return savedTask;
  }

  undo(): void {
    if (this.createdTaskId) {
      this.repository.delete(this.createdTaskId);
      console.log(`Undoing task creation: ${this.createdTaskId}`);
    }
  }
}
