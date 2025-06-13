import express from 'express';
import { TaskFactory } from '../factory/TaskFactory';
import { TaskObserver } from '../observer';
import { TaskRepositorySingleton } from '../repository/TaskRepositorySingleton';

const router = express.Router();
const taskObserver = new TaskObserver();
const taskRepository = TaskRepositorySingleton.getInstance();

// GET /tasks - Get all tasks
router.get('/', (req: any, res: any) => {
  try {
    const tasks = taskRepository.findAll();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:id - Get a specific task
router.get('/:id', (req: any, res: any) => {
  try {
    const { id } = req.params;
    const task = taskRepository.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Create a new task
router.post('/', (req: any, res: any) => {
  try {
    const { title, type, description, priority } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    // Use Factory Pattern to create the task for observer notification
    const task = TaskFactory.createTask(type, title);
    
    // Save in repository with original title (not prefixed)
    const savedTask = taskRepository.save({
      title: title,  // Save original title, not the decorated one
      description: description || '',
      priority: priority || 'normal',
      type: type
    });

    // Notify observers with the factory-created task (which may have prefixes)
    taskObserver.notify(task);

    res.status(201).json(savedTask);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deleted = taskRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id - Update a task
router.put('/:id', (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, description, priority, completed } = req.body;

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (completed !== undefined) updates.completed = completed;

    const updatedTask = taskRepository.update(id, updates);
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;