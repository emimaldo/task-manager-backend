// Singleton Pattern Implementation for Task Repository
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { InMemoryTaskRepository } from './InMemoryTaskRepository';

export class TaskRepositorySingleton {
  private static instance: ITaskRepository;

  static getInstance(): ITaskRepository {
    if (!TaskRepositorySingleton.instance) {
      TaskRepositorySingleton.instance = new InMemoryTaskRepository();
    }
    return TaskRepositorySingleton.instance;
  }

  // Method for testing - allows singleton reset
  static resetInstance(): void {
    TaskRepositorySingleton.instance = new InMemoryTaskRepository();
  }

  // Method for testing - allows mock injection
  static setInstance(repository: ITaskRepository): void {
    TaskRepositorySingleton.instance = repository;
  }
}
