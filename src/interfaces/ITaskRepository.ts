// Repository Interface - Defines the contract for data access
import { TaskModel, CreateTaskData, UpdateTaskData } from '../models/TaskModel';

export interface ITaskRepository {
  save(task: CreateTaskData): TaskModel;
  findById(id: string): TaskModel | null;
  findAll(): TaskModel[];
  update(id: string, updates: UpdateTaskData): TaskModel | null;
  delete(id: string): boolean;
  clear(): void;
}
