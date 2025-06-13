// Integration tests for the Task Manager system
// Tests the complete flow from API endpoints to pattern implementations

import request from 'supertest';
import { Express } from 'express';
import { app } from '../../src/server';
import { TaskRepositorySingleton } from '../../src/repository/TaskRepositorySingleton';
import { TaskModel } from '../../src/models/TaskModel';
import { TaskFactory } from '../../src/factory/TaskFactory';

describe('Task Manager Integration Tests', () => {
  let application: Express;

  beforeAll(() => {
    application = app;
  });

  beforeEach(() => {
    // Clear the repository before each test
    const repository = TaskRepositorySingleton.getInstance();
    repository.clear();
  });

  describe('Task CRUD Operations', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Integration Test Task',
        description: 'This is a test task for integration testing',
        priority: 'high',
        type: 'personal'
      };

      const response = await request(application)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.type).toBe(newTask.type);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should retrieve all tasks', async () => {
      // First, create some tasks
      const tasks = [
        { title: 'Task 1', description: 'First task', priority: 'high', type: 'work' },
        { title: 'Task 2', description: 'Second task', priority: 'medium', type: 'personal' },
        { title: 'Task 3', description: 'Third task', priority: 'low', type: 'work' }
      ];

      // Create tasks
      for (const task of tasks) {
        await request(application)
          .post('/api/tasks')
          .send(task)
          .expect(201);
      }

      // Retrieve all tasks
      const response = await request(application)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should retrieve a specific task by ID', async () => {
      // Create a task first
      const newTask = {
        title: 'Specific Task',
        description: 'Task to retrieve by ID',
        priority: 'medium',
        type: 'personal'
      };

      const createResponse = await request(application)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      const taskId = createResponse.body.id;

      // Retrieve the task by ID
      const response = await request(application)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
    });

    it('should update an existing task', async () => {
      // Create a task first
      const newTask = {
        title: 'Task to Update',
        description: 'Original description',
        priority: 'low',
        type: 'work'
      };

      const createResponse = await request(application)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      const taskId = createResponse.body.id;

      // Update the task
      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
        priority: 'high',
        completed: true
      };

      const response = await request(application)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.priority).toBe(updateData.priority);
      expect(response.body.completed).toBe(true);
    });

    it('should delete an existing task', async () => {
      // Create a task first
      const newTask = {
        title: 'Task to Delete',
        description: 'This task will be deleted',
        priority: 'medium',
        type: 'personal'
      };

      const createResponse = await request(application)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      const taskId = createResponse.body.id;

      // Delete the task
      await request(application)
        .delete(`/api/tasks/${taskId}`)
        .expect(204);

      // Try to retrieve the deleted task (should return 404)
      await request(application)
        .get(`/api/tasks/${taskId}`)
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent task', async () => {
      const response = await request(application)
        .get('/api/tasks/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Task not found');
    });

    it('should return 400 for invalid task data', async () => {
      const invalidTask = {
        // Missing required fields
        description: 'Task without title'
      };

      const response = await request(application)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 when updating non-existent task', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const response = await request(application)
        .put('/api/tasks/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(application)
        .delete('/api/tasks/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Design Patterns Integration', () => {
    describe('Factory Pattern Integration', () => {
      it('should create different types of tasks using Factory', async () => {
        const taskTypes = ['work', 'personal', 'hobby'];

        for (const type of taskTypes) {
          const taskData = {
            title: `${type} Task`,
            description: `A ${type} task created via factory`,
            priority: 'medium',
            type: type
          };

          const response = await request(application)
            .post('/api/tasks')
            .send(taskData)
            .expect(201);

          expect(response.body.type).toBe(type);
          expect(response.body.title).toBe(taskData.title);
        }
      });

      it('should handle unknown task types gracefully', async () => {
        const taskData = {
          title: 'Unknown Type Task',
          description: 'Task with unknown type',
          priority: 'medium',
          type: 'unknown'
        };

        const response = await request(application)
          .post('/api/tasks')
          .send(taskData)
          .expect(201);

        // Should still create the task, factory should handle unknown types
        expect(response.body.type).toBe('unknown');
      });
    });

    describe('Repository Pattern Integration', () => {
      it('should maintain data consistency across operations', async () => {
        // Create multiple tasks
        const tasks = [];
        for (let i = 1; i <= 5; i++) {
          const response = await request(application)
            .post('/api/tasks')
            .send({
              title: `Task ${i}`,
              description: `Description ${i}`,
              priority: 'medium',
              type: 'work'
            })
            .expect(201);
          tasks.push(response.body);
        }

        // Verify all tasks exist
        const getAllResponse = await request(application)
          .get('/api/tasks')
          .expect(200);

        expect(getAllResponse.body).toHaveLength(5);

        // Update one task
        const taskToUpdate = tasks[2];
        await request(application)
          .put(`/api/tasks/${taskToUpdate.id}`)
          .send({ title: 'Updated Task', completed: true })
          .expect(200);

        // Delete one task
        const taskToDelete = tasks[4];
        await request(application)
          .delete(`/api/tasks/${taskToDelete.id}`)
          .expect(204);

        // Verify final state
        const finalResponse = await request(application)
          .get('/api/tasks')
          .expect(200);

        expect(finalResponse.body).toHaveLength(4);
        
        const updatedTask = finalResponse.body.find((t: TaskModel) => t.id === taskToUpdate.id);
        expect(updatedTask).toBeTruthy();
        expect(updatedTask.title).toBe('Updated Task');
        expect(updatedTask.completed).toBe(true);

        const deletedTask = finalResponse.body.find((t: TaskModel) => t.id === taskToDelete.id);
        expect(deletedTask).toBeFalsy();
      });
    });

    describe('Singleton Pattern Integration', () => {
      it('should maintain singleton repository instance across requests', async () => {
        // Create a task in first request
        const task1Response = await request(application)
          .post('/api/tasks')
          .send({
            title: 'Singleton Test Task 1',
            description: 'First task',
            priority: 'high',
            type: 'work'
          })
          .expect(201);

        // Create another task in second request
        const task2Response = await request(application)
          .post('/api/tasks')
          .send({
            title: 'Singleton Test Task 2',
            description: 'Second task',
            priority: 'low',
            type: 'personal'
          })
          .expect(201);

        // Both tasks should be accessible in third request
        const getAllResponse = await request(application)
          .get('/api/tasks')
          .expect(200);

        expect(getAllResponse.body).toHaveLength(2);
        
        const taskIds = getAllResponse.body.map((t: TaskModel) => t.id);
        expect(taskIds).toContain(task1Response.body.id);
        expect(taskIds).toContain(task2Response.body.id);
      });
    });
  });

  describe('API Response Format', () => {
    it('should return consistent response format for all endpoints', async () => {
      // Create a task
      const createResponse = await request(application)
        .post('/api/tasks')
        .send({
          title: 'Format Test Task',
          description: 'Testing response format',
          priority: 'medium',
          type: 'work'
        })
        .expect(201);

      // Validate create response format
      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body).toHaveProperty('title');
      expect(createResponse.body).toHaveProperty('description');
      expect(createResponse.body).toHaveProperty('priority');
      expect(createResponse.body).toHaveProperty('type');
      expect(createResponse.body).toHaveProperty('completed');
      expect(createResponse.body).toHaveProperty('createdAt');

      const taskId = createResponse.body.id;

      // Get task response format
      const getResponse = await request(application)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(getResponse.body).toEqual(createResponse.body);

      // Update task response format
      const updateResponse = await request(application)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
      expect(updateResponse.body.id).toBe(taskId);
      expect(updateResponse.body.title).toBe('Updated Title');

      // Get all tasks response format
      const getAllResponse = await request(application)
        .get('/api/tasks')
        .expect(200);

      expect(Array.isArray(getAllResponse.body)).toBe(true);
      expect(getAllResponse.body[0]).toHaveProperty('id');
      expect(getAllResponse.body[0]).toHaveProperty('title');
    });
  });

  describe('Performance and Concurrency', () => {
    it('should handle multiple concurrent requests', async () => {
      const concurrentRequests = 10;
      const promises = [];

      // Create multiple tasks concurrently
      for (let i = 0; i < concurrentRequests; i++) {
        const promise = request(application)
          .post('/api/tasks')
          .send({
            title: `Concurrent Task ${i}`,
            description: `Concurrent test task ${i}`,
            priority: 'medium',
            type: 'work'
          });
        promises.push(promise);
      }

      const responses = await Promise.all(promises);

      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(`Concurrent Task ${index}`);
        expect(response.body).toHaveProperty('id');
      });

      // Verify all tasks were created
      const getAllResponse = await request(application)
        .get('/api/tasks')
        .expect(200);

      expect(getAllResponse.body).toHaveLength(concurrentRequests);
    });

    it('should handle rapid CRUD operations', async () => {
      const tasksToCreate = 5;
      const createdTasks = [];

      // Rapid creation
      for (let i = 0; i < tasksToCreate; i++) {
        const response = await request(application)
          .post('/api/tasks')
          .send({
            title: `Rapid Task ${i}`,
            description: `Rapid test ${i}`,
            priority: 'high',
            type: 'work'
          })
          .expect(201);
        createdTasks.push(response.body);
      }

      // Rapid updates
      for (const task of createdTasks) {
        await request(application)
          .put(`/api/tasks/${task.id}`)
          .send({ title: `Updated ${task.title}` })
          .expect(200);
      }

      // Rapid deletions
      for (let i = 0; i < 2; i++) {
        await request(application)
          .delete(`/api/tasks/${createdTasks[i].id}`)
          .expect(204);
      }

      // Verify final state
      const finalResponse = await request(application)
        .get('/api/tasks')
        .expect(200);

      expect(finalResponse.body).toHaveLength(tasksToCreate - 2);
    });
  });
});
