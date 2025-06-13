// Command Pattern - Command Factory
// Creates commands dynamically based on type and parameters

import { ICommand } from './ICommand';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { TaskObserver } from '../observer';
import { CreateTaskCommand } from './CreateTaskCommand';
import { DeleteTaskCommand } from './DeleteTaskCommand';
import { UpdateTaskCommand } from './UpdateTaskCommand';

export class CommandFactory {
  static createCommand(
    type: 'create' | 'delete' | 'update',
    params: any,
    repository: ITaskRepository,
    observer?: TaskObserver
  ): ICommand {
    switch (type) {
      case 'create':
        if (!observer) throw new Error('Observer required for create command');
        return new CreateTaskCommand(params.title, params.type, repository, observer);
      
      case 'delete':
        return new DeleteTaskCommand(params.taskId, repository);
      
      case 'update':
        return new UpdateTaskCommand(params.taskId, params.updates, repository);
      
      default:
        throw new Error(`Unknown command type: ${type}`);
    }
  }

  static createBatchCommand(
    commands: Array<{
      type: 'create' | 'delete' | 'update';
      params: any;
    }>,
    repository: ITaskRepository,
    observer?: TaskObserver
  ): ICommand[] {
    return commands.map(({ type, params }) => 
      this.createCommand(type, params, repository, observer)
    );
  }
}
