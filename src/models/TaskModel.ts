// Task Model - Defines the data structure for a task
export interface TaskModel {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  type: string;
  completed: boolean;
  createdAt: Date;
}

// Auxiliary types for the model
export type CreateTaskData = Omit<TaskModel, 'id' | 'createdAt' | 'completed'>;
export type UpdateTaskData = Partial<Pick<TaskModel, 'title' | 'description' | 'priority' | 'completed'>>;
