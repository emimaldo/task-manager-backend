// In-Memory Task Repository Implementation
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { TaskModel, CreateTaskData, UpdateTaskData } from '../models/TaskModel';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, TaskModel> = new Map();
  private currentId = 1;

  save(taskData: CreateTaskData): TaskModel {
    const newTask: TaskModel = {
      id: (this.currentId++).toString(),
      createdAt: new Date(),
      completed: false,
      ...taskData
    };
    
    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  findById(id: string): TaskModel | null {
    return this.tasks.get(id) || null;
  }

  findAll(): TaskModel[] {
    return Array.from(this.tasks.values());
  }

  update(id: string, updates: UpdateTaskData): TaskModel | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }

  clear(): void {
    this.tasks.clear();
    this.currentId = 1;
  }

  // Convenience methods for compatibility
  getAllTasks(): TaskModel[] {
    return this.findAll();
  }

  updateTask(id: string, updates: UpdateTaskData): TaskModel | null {
    return this.update(id, updates);
  }

  deleteTask(id: string): boolean {
    return this.delete(id);
  }
}
